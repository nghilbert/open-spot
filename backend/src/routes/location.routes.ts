import { Router, Request, Response } from "express";
import { requireAuth, verifyAdmin } from "../middleware";
import { locationController } from "../controllers";

export default function createLocationRoutes() {
	const router = Router();

	router.get("/getAll", requireAuth, async (req: Request, res: Response) => {
		try {
			const locations = await locationController.getAll();
			res.status(200).json(locations);
		} catch (error) {
			console.error("Failed to get locations:", error);
			res.status(500).json({ error: "Failed to get locations" });
		}
	});

	router.post("/remove", requireAuth, verifyAdmin, async (req: Request, res: Response) => {
		// Extract id from request body
		const { id } = req.body;

		// Attempt to remove a parking lot object
		if (await locationController.remove(id)) {
			// Successful removal
			res.status(200).json({ success: true });
		} else {
			// Send an error
			res.status(400).json({ success: false });
		}
	});

	router.post("/update", requireAuth, verifyAdmin, async (req: Request, res: Response) => {
		try {
			const id = Number(req.body.data.modelLocationID);

			const location = await locationController.getLocation(id);

			if (!location) {
				return res.status(404).json({ error: "Failed to find the location" });
			}

			// calc spotAvailability
			const total = Number(req.body.data.modelTotal);
			const used = Number(req.body.data.modelUsed);
			const spotAvailability = total - used;

			const update = await locationController.updateLocation(
				id,
				Number(req.body.data.modelNumber), // house number
				req.body.data.modelStreet,
				req.body.data.modelCity,
				req.body.data.modelState,
				Number(req.body.data.modelZip),
				req.body.data.modelName,
				total,
				spotAvailability,
				req.body.data.modelPermit,
				req.body.data.modelType
			);

			if (update) {
				res.status(200).json({ message: "Update received", data: update });
			} else {
				res.status(400).json({ error: "Failed to update location" });
			}
		} catch (err) {
			console.error(err);
			res.status(500).json({ error: "Server error" });
		}
	});

	return router;
}
