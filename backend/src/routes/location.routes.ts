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

	router.delete("/:id", requireAuth, verifyAdmin, async (req: Request, res: Response) => {
		const id = parseInt(req.params.id, 10);

		// Attempt to remove a parking lot object
		if (await locationController.remove(id)) {
			// Successful removal
			res.status(200).json({ success: true });
		} else {
			// Send an error
			res.status(400).json({ success: false });
		}
	});

	router.put("/:id", requireAuth, verifyAdmin, async (req: Request, res: Response) => {
		try {
			const locationId = parseInt(req.params.id, 10);
			const data = req.body.data;

			const location = await locationController.getLocation(locationId);
			if (!location) {
				return res.status(404).json({ error: "Failed to find the location" });
			}

			// calc spotAvailability
			const spotCapacity = Number(req.body.data.total);
			const spotAvailability = spotCapacity - Number(req.body.data.used);

			const update = await locationController.updateLocation(
				locationId,
				Number(data.number), // house number
				data.street,
				data.city,
				data.state,
				Number(data.zip),
				data.name,
				spotCapacity,
				spotAvailability,
				data.permit,
				data.type,
				Number(data.timeLimitSecs)
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
