import { Router, Response } from "express";
import { requireAuth } from "../middleware";
import { locationController } from "../controllers";

export default function createLocationRoutes() {
	const router = Router();

	router.get("/getAll", requireAuth, async (res: Response) => {
		const locations = await locationController.getAll();
		res.status(200).json(locations);
	});
	return router;
}
