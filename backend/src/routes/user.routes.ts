import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { accountController, loginController, createAccountController } from "../controllers";

export default function createUserRoutes() {
	const router = Router();

	router.post("/register", async (req, res) => {
		// Create a user with the account manager
		let data = req.body;
		let name: string = data.name;
		let email: string = data.email;
		let password: string = data.password;

		if (await createAccountController.register(email, password, name)) {
			// Successful creation
			res.status(200).json({redirectTo:"/onboarding_page"});
		} else {
			// Send an error
			res.status(400).json({ success: false });
		}
	});

	router.post("/login", async (req: Request, res: Response) => {
		// Ask the account manager to log the user in
		let data = req.body;
		let email: string = data.email;
		let password: string = data.password;

		if (!email || !password) {
			return res.status(400).json({ error: "Missing email or password" });
		}

		let sessionToken = await loginController.login(email, password);

		if (sessionToken) {
			// Successful creation
			res.cookie("session", sessionToken, {
				httpOnly: true,
				secure: false,
				sameSite: "lax",
			});

			res.status(200).end();
		} else {
			// Send an error
			res.status(401).json({ success: false });
		}
	});

	router.post("/logout", requireAuth, async (req: Request, res: Response) => {
		// Ask the account manager to log the user out
		const sessionToken = (req as any).cookies?.session;

		if (sessionToken) {
			// Successful
			accountController.logout(sessionToken);
			res.status(200).end();
		} else {
			// Send an error
			res.status(400).end();
		}
	});

	router.post("/exists", async (req: Request, res: Response) => {
		// Ask the account manager to log the user in
		let data = req.body;
		let email: string = data.email;

		let exists = await accountController.emailExists(email);

		if (exists) {
			// Successful creation
			res.status(200).end();
		} else {
			// Send an error
			res.status(400).end();
		}
	});

	router.get("/name", requireAuth, async (req: Request, res: Response) => {
		// Ask the account manager to log the user in
		res.end((req as unknown as AuthenticatedRequest).user.name);
	});

	return router;
}
