import { Session, User } from "@openspot/shared";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

export class AccountController {
    // Variables
    private prisma: PrismaClient;

    // Functions
    constructor(prisma: PrismaClient){
        this.prisma = prisma;
    }

    public async getRole(email:string) {

        const user = await this.prisma.user.findUnique({
        where: { email:email },
        select: { role: true }
    });

        return user?.role;

    }

    public async emailExists(email: string): Promise<boolean> {
        // This function returns true or false depending on if the email exists for a user
        const prisma = this.prisma;

        // Creates the password hash to check for
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

        // Creates the password hash to check for
        try {
            const sessionExists = await prisma.session.findUnique({ where: { sessionToken } });
            return sessionExists !== null;
        } catch (error) {
            console.error("Error finding session: ", error);
            return false;
        }
    }

    public async getUserSession(sessionToken: Session): Promise<User|null> {
        // This function returns true or false depending on if the session is valid
        const prisma = this.prisma;

        // Creates the password hash to check for
        try {
            const sessionExists = await prisma.session.findUnique({ where: { sessionToken }, include: { user: true } });

            if(sessionExists){
                return sessionExists.user;
            }

            return null;
        } catch (error) {
            console.error("Error finding session: ", error);
            return null;
        }
    }

    public async logout(sessionToken: Session): Promise<boolean> {
        try {
            // Attempt to delete the session from the database based on the session token
            await this.prisma.session.delete({
                where: { sessionToken },
            });
            // If successful, return true
            return true;
        // Log any error that occurred during the session deletion
        } catch (error) {
            console.error("Error logging out: ", error);
            // Return false to indicate logout failure
            return false;
        }
    }

   
};
