import { User } from "@openspot/shared";
import { prismaClient } from "../../prismaClient";
import { randomBytes } from "crypto";
import { Resend } from "resend";

const hostname = process.env.HOSTNAME || "http://localhost:3000";

export class EmailController {
	// Variables
	private emailService;
	private prisma = prismaClient;

	// Functions
	constructor() {
		// Create mailing system, which for simplicity is gmail
		this.emailService = new Resend(process.env.RESEND_API_KEY);
	}

	private isEmail(address: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(address);
	}

	public async sendEmail(address: string, subject: string, content: string): Promise<boolean> {
		// This is a generic email sending function
		if (!this.isEmail(address)) {
			return false;
		}

		let response = await this.emailService.emails.send({
			from: "onboarding@resend.dev",
			to: address,
			subject: subject,
			html: content,
		});

		if (response.error) {
			console.error(response.error);
		}

		return response.error !== null;
	}

	public async sendVerificationEmail(user: User) {
		// Create the token to prove verification
		const token = randomBytes(32).toString("hex");

		await this.prisma.verify.create({
			data: {
				token: token,
				userID: user.id,
			},
		});

		// Format an email with a link to the verification API
		let content = `
        <p>Hello, please click this link to verify your email.</p><br>
        <a href="${hostname}/verify?token=${token}">Verify here</a>
        `;
		return await this.sendEmail(user.email, "Verify email", content);
	}

	public async finishVerification(token: string) {
		// Remove the token from the verification table
		const verifyRow = await this.prisma.verify.findUnique({
			where: {
				token: token,
			},
		});

		if (verifyRow) {
			// The row exists, make sure its not expired
			const userID = verifyRow.userID;

			await this.prisma.verify.delete({
				where: {
					token: token,
				},
			});

			// Update the user to be verified
			let user = await this.prisma.user.findUnique({
				where: {
					id: userID,
				},
			});

			// Format an email with a link to the verification API
			if (user) {
				await this.prisma.user.update({
					data: {
						emailVerified: true,
					},
					where: {
						id: userID,
					},
				});

				let content = `<p>Thank you for verifying your email.</p>`;
				await this.sendEmail(user.email, "Verify email", content);
				return true;
			}
		}

		return false;
	}
}
