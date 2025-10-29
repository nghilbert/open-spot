import { AccountController } from "./account/AccountController";
import { LoginController } from "./account/LoginController";
import { CreateAccountController } from "./account/CreateAccountController";
import { LogoutController } from "./account/LogoutController";
import { EmailController } from "./account/EmailController";
import { ParkingLotController } from "./location/ParkingLotController";

export const accountController = new AccountController();
export const loginController = new LoginController();
export const createAccountController = new CreateAccountController();
export const logoutController = new LogoutController();
export const parkingLotController = new ParkingLotController();
export const emailController = new EmailController();
