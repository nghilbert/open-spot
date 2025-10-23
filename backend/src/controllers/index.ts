import { PrismaClient } from "@prisma/client";
import { AccountController } from "./AccountController";
import { LoginController } from "./LoginController";
import { CreateAccountController } from "./CreateAccountController";

const prisma = new PrismaClient();

export const accountController = new AccountController(prisma);
export const loginController = new LoginController(prisma);
export const createAccountController = new CreateAccountController(prisma);
