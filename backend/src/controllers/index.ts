import { PrismaClient } from "@prisma/client";
import { AccountController } from "./AccountController";
import { LoginController } from "./LoginController";
import { CreateAccountController } from "./CreateAccountController";
import { LogoutController } from "./LogoutController";

const prisma = new PrismaClient();

export const accountController = new AccountController(prisma);
export const loginController = new LoginController(prisma);
export const createAccountController = new CreateAccountController(prisma);
export const logoutController = new LogoutController(prisma);
