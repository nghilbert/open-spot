import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

export class CreateAccountController {
	private prisma: PrismaClient;

	constructor(prisma: PrismaClient) {
		this.prisma = prisma;
	}

	async register(email: string, password: string, name: string): Promise<boolean> {
		// Basic validation
		if (!email || !password) {
			return false;
		}

		// Check if this is an ISU email
		const isIlstuEmail = email.toLowerCase().endsWith("@ilstu.edu");
		if (!isIlstuEmail) {
			console.warn(`The Email ${email} is not an ilstu.edu email`);
			return false;
		}

		// Check if email already exists
		const existingUser = await this.prisma.user.findUnique({ where: { email } });
		if (existingUser) {
			console.warn(`The Email ${email} is already in use`);
			return false;
		}

		// Hash password
		// Creates the password hash to insert to the DB
		const salt = await bcrypt.genSalt();
		const passwordHash = await bcrypt.hash(password, salt);

		// Create user
		await this.prisma.user.create({
			data: {
				email: email,
				passwordHash: passwordHash,
				name: "",
			},
		});

		return true;
	}
}
