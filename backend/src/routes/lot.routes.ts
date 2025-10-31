import { Router, Request, Response } from "express";
import { verifyAdmin } from "../middleware/verifyAdmin";
import { parkingLotController } from "../controllers";

export default function createLotRoutes() {
	const router = Router();

	router.post("/add", verifyAdmin, async (req: Request, res: Response) => {
		// Extract values from request body
		const { address, spotCapacity, name } = req.body;

		// Attempt to create a parking lot object
		if (await parkingLotController.addLot(address, spotCapacity, name)) {
			// Successful creation
			res.status(200).json({ redirectTo: "/onboarding_page" });
		} else {
			// Send an error
			res.status(400).json({ success: false });
		}
	});
	return router;
}
