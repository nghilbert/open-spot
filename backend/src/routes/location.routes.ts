import { Router, Request, Response } from "express";
import { requireAuth, verifyAdmin } from "../middleware";
import { locationController } from "../controllers";
import { Location } from "@prisma/client";

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

	router.get("/get/:id", requireAuth, async (req: Request, res: Response) => {
		try {
			const location = await locationController.getLocation(parseInt(req.params.id));

			if (location) {
				res.status(200).json(location);
				return;
			}
		} catch (error) {
			console.error("Failed to get locations:", error);
		}

		res.status(404).end();
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

	router.post("/add", requireAuth, verifyAdmin, async (req: Request, res: Response) => {
		const newLocation = req.body;

		// Attempt to create a parking lot object
		if (await locationController.add(newLocation)) {
			// Successful creation
			res.status(200).json({ success: true });
		} else {
			// Send an error
			res.status(400).json({ success: false });
		}
	});

	router.patch("/:id", requireAuth, verifyAdmin, async (req: Request, res: Response) => {
		try {
			const locationId = parseInt(req.params.id, 10);
			const locationUpdates: Partial<Location> = req.body.data as Location;
			delete locationUpdates.id;

			if (!(await locationController.getLocation(locationId))) {
				return res.status(404).json({ error: "Failed to find the location" });
			}

			const isUpdated = await locationController.updateLocation(locationId, locationUpdates);

			if (isUpdated) {
				res.status(200).json({ message: "Location was updated" });
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
