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

    public async createAccount(email: string, password: string, name: string): Promise<boolean> {
        // Creates a new user object. It returns true if the user was created successfully and false
        // if it fails. i.e. email in use.
        const prisma = this.prisma;

        try {
            // Creates the password hash to insert to the DB
            const salt = await bcrypt.genSalt();
            const passwordHash = await bcrypt.hash(password, salt);

            // Insert the data into the DB
            const user: Omit<User, "id"|"sessions"> = {
                email,
                passwordHash,
                name
            };
            await prisma.user.create({ data: user });

            return true;
        } catch (error) {
            console.error("Error creating user: ", error);
            return false; // Errored out, so no session can be returned
        }
    }
};
