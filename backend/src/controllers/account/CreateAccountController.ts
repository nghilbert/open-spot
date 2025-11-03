import { prismaClient } from "../../prismaClient";
import { emailController } from "../";
import bcrypt from "bcrypt";

export class CreateAccountController {
	private prisma = prismaClient;

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
		//create password
		const passwordRecord = await this.prisma.password.create({
		data: {
			passwordHash
		}
		});

		// Create user
		const user = await this.prisma.user.create({
		data: {
			email:email,
			name:name ,
			PasswordID: passwordRecord.passwordId
		},
		include: {
			password: true
		}
		});



		// Send off verification email
		await emailController.sendVerificationEmail(user);

		return true;
	}
}
