import { PrismaClient } from "@prisma/client";
import { AccountController } from "./AccountController";
import { LoginController } from "./LoginController";

const prisma = new PrismaClient();

export const accountController = new AccountController(prisma);
export const loginController = new LoginController(prisma);
