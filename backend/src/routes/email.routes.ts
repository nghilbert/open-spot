import { Request, Router } from "express";
import { emailController } from "../controllers";

export default function createEmailRoutes() {
	// Request typings
	interface VerifyQueries {
		token: string
	};

	// Router
	const router = Router();

	router.get("/verify", async (req: Request<{}, {}, {}, VerifyQueries>, res) => {
		// Route to handle /verify?token=TOKENHERE
		// This is the API to take a saved verification token and remove it, marking the user as verified
		const { token } = req.query;

		if(!token){
			// No token provided in the link, send an error
			res.status(400).json({ success: false });
		}

		// Token was sent, check if it was successful
		if(await emailController.finishVerification(token)){
			// Successful verification
			res.status(200).json({ success: true });
		} else {
			// Unsuccessful verification
			res.status(400).json({ success: false });
		}
	});

	return router;
}
