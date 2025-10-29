import { AccountController } from "./account/AccountController";
import { LoginController } from "./account/LoginController";
import { CreateAccountController } from "./account/CreateAccountController";
import { LogoutController } from "./account/LogoutController";

export const accountController = new AccountController();
export const loginController = new LoginController();
export const createAccountController = new CreateAccountController();
export const logoutController = new LogoutController();
