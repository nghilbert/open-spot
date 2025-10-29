import { AccountController } from "./AccountController";
import { LoginController } from "./LoginController";
import { CreateAccountController } from "./CreateAccountController";
import { LogoutController } from "./LogoutController";

export const accountController = new AccountController();
export const loginController = new LoginController();
export const createAccountController = new CreateAccountController();
export const logoutController = new LogoutController();
