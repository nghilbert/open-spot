import { PrismaClient } from "@prisma/client";

export class LogoutController {
  private prisma: PrismaClient;

  // ✅ Constructor must be here
  constructor(prisma: PrismaClient) {
    this.prisma = prisma;
  }

  // ✅ sessionToken should likely be a string
  public async logout(sessionToken: string): Promise<boolean> {
    try {
      // Attempt to delete the session from the database based on the session token
      await this.prisma.session.delete({
        where: { sessionToken },
      });
      // If successful, return true
      return true;
    } catch (error) {
      console.error("Error logging out: ", error);
      // Return false to indicate logout failure
      return false;
    }
  }
}
