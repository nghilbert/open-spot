import { AccountController } from "../controllers/AccountController.js";
import { LoginController } from "../controllers/LoginController.js";

export interface Controllers {
	accountController: AccountController;
	loginController: LoginController;
}
