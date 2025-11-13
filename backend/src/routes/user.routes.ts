import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware/requireAuth";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { accountController, loginController, createAccountController, logoutController, emailController } from "../controllers";
import { Permit, UserType } from "@prisma/client";


export default function createUserRoutes() {
	// Request typings
	interface ResetQuery {
		token: string
	};

	interface ResetBody {
		password: string
	};

	interface PatchPayload {
		name: string,
		username: string,
		type: UserType,
		permit: Permit
	}

	// Constants
	const hostname = process.env.HOSTNAME || "http://localhost:3000";
	const router = Router();

	// Routes
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

			res.status(200).json({redirectTo:"/dashboard"});
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
			logoutController.logout(sessionToken);
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

	router.patch("/profile", requireAuth, async (req: Request, res: Response) => {
		// Edit profile route
		const authReq = (req as unknown as AuthenticatedRequest);
		const user = authReq.user;
		const payload = authReq.body as unknown as PatchPayload;

		if(await accountController.updateAccount(user.id, undefined, undefined, payload.name, payload.username, payload.type, payload.permit)){
			res.status(200).end();
		} else {
			res.status(401).json({ error: "Invalid session" });
		}
	});

	router.get("/profile", requireAuth, async (req: Request, res: Response) => {
		const sessionToken = (req as any).cookies?.session;

		if (sessionToken) {
			let user = await accountController.getUserSession(sessionToken);
			
			if (user) {
				if(user.password) delete user.password;
				res.status(200).json(user);
			} else {
				res.status(401).json({ error: "Invalid session" });
			}
		} else {
			res.status(401).json({ error: "No session token provided" });
		}
	});

	router.get("/reset/:email", async (req: Request, res: Response) => {
		const user = await accountController.getUserFromEmail(req.params.email);

		if(user){
			res.status(200).json({success: await accountController.createPasswordReset(user)});
		} else {
			res.status(400).json({ success: false });
		}
	});

	router.post("/reset", async (req: Request, res: Response) => {
		const query = req.query as unknown as ResetQuery;
		const body = req.body as unknown as ResetBody;

		// Route to handle /reset?token=TOKENHERE
		// This is the API to take a saved verification token and remove it, marking the user as verified
		const { token } = query;
		const { password } = body;

		if(!token){
			// No token provided in the link, send an error
			res.status(400).json({ success: false });
		}

		if(!password){
			// No password provided in body, send an error
			res.status(400).json({ success: false });
		}

		// Token was sent, check if it was successful
		if(await accountController.finishPasswordReset(token, password)){
			// Successful reset link, 
			res.status(200).json({ success: true });
		} else {
			// Unsuccessful reset link
			res.status(400).json({ success: false });
		}
	});

	return router;
}
