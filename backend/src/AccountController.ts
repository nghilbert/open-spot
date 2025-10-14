import { Session, User } from "@openspot/shared";
import { PrismaClient } from "@prisma/client";
import * as bcrypt from "bcrypt";

export class AccountController {
    // Variables
    prisma: PrismaClient;

    // Functions
    constructor(prisma: PrismaClient){
        this.prisma = prisma;
    }

    private async generateSession(user: User): Session {
        // Creates a new session object

    }

    public async login(email: string, password: string): Promise<Session|null> {
        // Simple login function to check for existing user and matching password.
        // If authenticates, it will create a new session for the user
        const prisma = this.prisma;

        // Creates the password hash to check for
        try {
            const user: User = await prisma.user.findUnique({
                where: {
                    email: email
                },
            });

            // Make sure the user exists and the password checks out
            if(user && await bcrypt.compare(password, user.passwordHash)) {
                return this.generateSession(user);
            } else {
                // Email doesn't exist, return no session
                return null;
            }
        } catch (error) {
            console.error("Error finding user: ", error);
            return null; // Errored out, so no session can be returned
        } finally {
            // Cleanup
            await this.prisma.$disconnect();
        }
    }
};