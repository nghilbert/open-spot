import { Router } from "express";
import createUserRoutes from "./user.routes";
import createLotRoutes from "./lot.routes";

export default function createRoutes() {
	const router = Router();
	console.log("Mounting /api/user routes...");
	router.use("/user", createUserRoutes());
	console.log("Mounting /api/lot routes...");
	router.use("/lot", createLotRoutes());
	return router;
}
