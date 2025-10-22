import { PrismaClient } from "@prisma/client";
import { AccountController } from "./AccountController";
import { LoginController } from "./LoginController";
import { Controllers } from "../types/controllers";

// Factory that builds and wires controllers
export function createControllers(prisma: PrismaClient): Controllers {
	return {
		accountController: new AccountController(prisma),
		loginController: new LoginController(prisma),
	};
}
