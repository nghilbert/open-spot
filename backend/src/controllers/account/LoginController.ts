import { User } from "@prisma/client";
import { prismaClient } from "../../prismaClient";
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

	public async login(email: string, password: string): Promise<string | null> {
  const prisma = this.prisma;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: { password: true },
    });

    // If no user found, bail early
    if (!user) {
      return null;
    }

    // If email not verified, bail early
    if (!user.emailVerified) {
      return null;
    }

    // Extract stored hash
    const currentPassword = user.password?.passwordHash ?? "";

    // Check password AND verified status
    const passwordMatches = await bcrypt.compare(password, String(currentPassword));

    if (passwordMatches) {
      return this.generateSession(user);
    }

    return null;
  } catch (error) {
    console.error("Error finding user: ", error);
    return null;
  }
}
}
