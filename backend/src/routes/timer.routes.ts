import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware";
import { timerController } from "../controllers";
import { AuthenticatedRequest } from "../types/authenticatedRequest";
import { prismaClient } from "../prismaClient";
import { Location } from "@prisma/client";
import { CreateTimerRequest } from "@openspot/shared";

export default function createTimerRoutes() {
	const router = Router();

	// Getting
	router.get("/", requireAuth, async (req: Request, res: Response) => {
		// Gets the status of the user's current timer
		const auth = (req as any as AuthenticatedRequest);
		const result = await timerController.getTimerStatus(auth.user.id);

		// Attempt to create a parking lot object
		if(result){
			// There is a timer with some sort of status, return it
			res.status(200).json(result);
		} else {
			// Send an error
			res.status(404).end();
		}
	});

	// Creating/ending
	router.post("/", requireAuth, async (req: Request, res: Response) => {
		// Starts a timer for the user
		const auth = (req as any as AuthenticatedRequest);
		const body = req.body as CreateTimerRequest;
		const user = await prismaClient.user.findUnique({ where: { id: auth.user.id }});
		const location = await prismaClient.location.findUnique({ where: { id: body.locationID }});

		// Attempt to create a parking lot object
		if(user && location && await timerController.startTimer(user, location, body.seconds)){
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

	// Confirming
	router.post("/confirm", requireAuth, async (req: Request, res: Response) => {
		// Starts a timer for the user
		const auth = (req as any as AuthenticatedRequest);

		// Attempt to create a parking lot object
		if(await timerController.reconfirmTimer(auth.user.id)){
			// There is a timer with some sort of status, return it
			res.status(200).end();
		} else {
			// Send an error
			res.status(400).end();
		}
	});

	return router;
}
