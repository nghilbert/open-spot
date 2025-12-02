import { AccountController } from "./account/AccountController";
import { LoginController } from "./account/LoginController";
import { CreateAccountController } from "./account/CreateAccountController";
import { LogoutController } from "./account/LogoutController";
import { EmailController } from "./account/EmailController";
import { LocationController } from "./location/LocationController";
import { TimerController } from "./timerController";

export const accountController = new AccountController();
export const loginController = new LoginController();
export const createAccountController = new CreateAccountController();
export const logoutController = new LogoutController();
export const locationController = new LocationController();
export const emailController = new EmailController();
export const timerController = new TimerController();
