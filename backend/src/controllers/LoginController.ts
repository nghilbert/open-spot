import { Session, User } from "@openspot/shared";
import { prismaClient } from "../prismaClient";
import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";

export class LoginController {
	// Variables
	private prisma = prismaClient;

	// Functions
	private async generateSession(user: User): Promise<string> {
		// Creates a new session object
		const sessionToken = randomBytes(32).toString("hex");

		// Send data to database
		await this.prisma.session.create({
			data: {
				userID: user.id,
				sessionToken,
			},
		});

		// Return the resultant session token
		return sessionToken;
	}

	public async login(email: string, password: string): Promise<Session | null> {
		// Simple login function to check for existing user and matching password.
		// If authenticates, it will create a new session for the user
		const prisma = this.prisma;

		// Creates the password hash to check for
		try {
			const user: User | null = await prisma.user.findUnique({
				where: {
					email: email,
				},
			});

			// Make sure the user exists and the password checks out
			if (user && (await bcrypt.compare(password, user.passwordHash))) {
				return this.generateSession(user);
			} else {
				// Email doesn't exist, return no session
				return null;
			}
		} catch (error) {
			console.error("Error finding user: ", error);
			return null; // Errored out, so no session can be returned
		}
	}
}
