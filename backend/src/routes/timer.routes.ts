import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware";
import { timerController } from "../controllers";
import { AuthenticatedRequest } from "../types/authenticatedRequest";

interface CreateTimerRequest {

};

export default function createTimerRoutes() {
	const router = Router();

	router.get("/", requireAuth, async (req: Request, res: Response) => {
		// Gets the status of the user's current timer
		const auth = (req as any as AuthenticatedRequest);
		const result = await timerController.getTimerStatus(auth.user.id);

		// Attempt to create a parking lot object
		if(result){
			// There is a timer with some sort of status, return it
			res.status(200).json({ status: result });
		} else {
			// Send an error
			res.status(404).json({ status: null });
		}
	});

	router.post("/", requireAuth, async (req: Request, res: Response) => {
		// Starts a timer for the user
		const auth = (req as any as AuthenticatedRequest);

		// Attempt to create a parking lot object
		if(await timerController.endTimer(auth.user.id)){
			// There is a timer with some sort of status, return it
			res.status(200).end();
		} else {
			// Send an error
			res.status(400).end();
		}
	});

	router.delete("/", requireAuth, async (req: Request, res: Response) => {
		// Ends the timer the user was currently using
		const auth = (req as any as AuthenticatedRequest);

		// Attempt to create a parking lot object
		if(await timerController.endTimer(auth.user.id)){
			// There is a timer with some sort of status, return it
			res.status(200).end();
		} else {
			// Send an error
			res.status(400).end();
		}
	});

	return router;
}
