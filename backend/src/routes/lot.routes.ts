import { Router, Request, Response } from "express";
import { requireAuth, verifyAdmin } from "../middleware";
import { parkingLotController } from "../controllers";

export default function createLotRoutes() {
	const router = Router();

	router.post("/add", requireAuth, verifyAdmin, async (req: Request, res: Response) => {
		// Extract values from request body
		const { address, spotCapacity, name } = req.body;

		// Attempt to create a parking lot object
		if (await parkingLotController.add(address, spotCapacity, name)) {
			// Successful creation
			res.status(200).json({ success: true });
		} else {
			// Send an error
			res.status(400).json({ success: false });
		}
	});
	return router;
}
