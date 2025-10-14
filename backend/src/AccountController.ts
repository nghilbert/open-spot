import { Session, User } from "@openspot/shared";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import * as bcrypt from "bcrypt";

export class AccountController {
    // Variables
    prisma: PrismaClient;

    // Functions
    constructor(prisma: PrismaClient){
        this.prisma = prisma;
    }

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
        } finally {
            // Cleanup
            await this.prisma.$disconnect();
        }
    }

    public async login(email: string, password: string): Promise<Session|null> {
        // Simple login function to check for existing user and matching password.
        // If authenticates, it will create a new session for the user
        const prisma = this.prisma;

        // Creates the password hash to check for
        try {
            const user: User|null = await prisma.user.findUnique({
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
        } finally {
            // Cleanup
            await this.prisma.$disconnect();
        }
    }
};