import { Session, User } from "@openspot/shared";
import { prismaClient } from "../../prismaClient";
import { randomBytes } from "crypto";
import { emailController } from "..";
import bcrypt from "bcrypt";

export class AccountController {
	// Variables
	private prisma = prismaClient;

	public async getRole(email: string) {
		const user = await this.prisma.user.findUnique({
			where: { email: email },
			select: { role: true },
		});

		return user?.role;
	}

	public async emailExists(email: string): Promise<boolean> {
		// This function returns true or false depending on if the email exists for a user
		const prisma = this.prisma;

		try {
			const userExists = await prisma.user.findUnique({ where: { email } });
			return userExists !== null;
		} catch (error) {
			console.error("Error finding user: ", error);
			return false;
		}
	}

	public async isValidSession(sessionToken: Session): Promise<boolean> {
		// This function returns true or false depending on if the session is valid
		const prisma = this.prisma;

		try {
			const sessionExists = await prisma.session.findUnique({ where: { sessionToken } });
			return sessionExists !== null;
		} catch (error) {
			console.error("Error finding session: ", error);
			return false;
		}
	}

	public async getUserSession(sessionToken: Session): Promise<User | null> {
		// Returns the user object if the sessiontoken is valid and found, otherwise null
		const prisma = this.prisma;

		// trys to find the session based on the session token and gets the user
		try {
			const sessionExists = await prisma.session.findUnique({ where: { sessionToken }, include: { user: true } });

			if (sessionExists) {
				return sessionExists.user; //if found return the user object
			}

			return null;
		} catch (error) {
			console.error("Error finding session: ", error);
			return null;
		}
	}

	public async updateAccount(userID: number, email?: string, password?: string, name?: string): Promise<boolean> {
        // Creates a new user object. It returns true if the user was created successfully and false
        // if it fails. i.e. email in use.
        const prisma = this.prisma;

        try {
            // Creates the password hash to insert to the DB
            const salt = await bcrypt.genSalt();
            const passwordHash = password ? await bcrypt.hash(password, salt) : undefined;

            // Insert the data into the DB
            const newUser = await prisma.user.update({
                where: {
                    id: userID
                },
                data: {
                    email,
                    name
                },
				include: {
					password: true
				}
            });

			// Update the password if specified
			if(passwordHash){
				const newPasswordEntry = await prisma.password.create({
					data: {
						passwordHash: passwordHash
					}
				});

				await prisma.user.update({
					where: { id: userID },
					data: {
						oldPasswords: { connect: { passwordId: newUser.PasswordID } },
						password: { connect: { passwordId: newPasswordEntry.passwordId } },
					},
				});
			}

            return true;
        } catch (error) {
            console.error("Error updating user: ", error);
            return false;
        }
    }

	public async getUserFromEmail(email: string): Promise<User|null> {
		// Gets the user or null depending on the email given
		const user = this.prisma.user.findUnique({ where: { email }});
		return user;
	}

	public async createPasswordReset(user: User): Promise<boolean> {
		// Creates a password reset token and returns the link to reset or null to back
		const hostname = process.env.HOSTNAME || "http://localhost:3000";
		const token = randomBytes(32).toString("hex");
	
		await this.prisma.resetToken.create({
			data: {
				token,
				userID: user.id,
			},
		});
	
		const content = `
			<p>Hello, please click this link to reset your password.</p><br>
			<a href="${hostname}/reset_password?token=${token}">Click here</a>
		`;
	
		return await emailController.sendEmail(user.email, "Reset password", content);
	}

	public async finishPasswordReset(token: string, newPassword: string): Promise<boolean> {
		// Finishes the password reset and remove sthe entry
		try {
			const resetRow = await this.prisma.resetToken.findUnique({ where: { token }});
			if(!resetRow) return false;

			const isExpired = Date.now() - new Date(resetRow.createdAt).getTime() > 1000 * 60 * 60 * 24;
			if (isExpired) {
				await this.prisma.resetToken.delete({ where: { token } });
				return false;
			}

			const userID = resetRow.userID;
			const userRow = await this.prisma.user.findUnique({ where: { id: userID }, include: { password: true, oldPasswords: true } });
			if (!userRow) return false;

			// Make sure the user's new password isnt an old password
			for(let pass of userRow.oldPasswords){
				if(await bcrypt.compare(newPassword, pass.passwordHash)){
					return false;
				}
			}

			if(await bcrypt.compare(newPassword, userRow.password.passwordHash)){
				return false;
			}

			await this.prisma.resetToken.delete({ where: { token } });

			return await this.updateAccount(userID, undefined, newPassword, undefined);
		} catch(err){
			console.error(err);
			return false;
		}
	}
}
