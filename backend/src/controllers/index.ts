import { PrismaClient } from "@prisma/client";
import { AccountController } from "./AccountController";
import { LoginController } from "./LoginController";
import { CreateAccountController } from "./CreateAccountController";
import { LogoutController } from "./LogoutController";
import { EmailController } from "./EmailController";

const prisma = new PrismaClient();

export const accountController = new AccountController(prisma);
export const loginController = new LoginController(prisma);
export const createAccountController = new CreateAccountController(prisma);
export const logoutController = new LogoutController(prisma);
export const emailController = new EmailController();
