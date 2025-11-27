import { Router, Request, Response } from "express";
import { requireAuth } from "../middleware";
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

  return router;
}
