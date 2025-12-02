import { Router } from "express";
import createUserRoutes from "./user.routes";
import createEmailRoutes from "./email.routes";
import createLocationRoutes from "./location.routes";
import createTimerRoutes from "./timer.routes";

export default function createRoutes() {
	const router = Router();

	console.log("Mounting /api/user routes...");
	router.use("/user", createUserRoutes());

	console.log("Mounting /api/email routes...");
	router.use("/email", createEmailRoutes());

	console.log("Mounting /api/location routes...");
	router.use("/location", createLocationRoutes());

	console.log("Mounting /api/timer routes...");
	router.use("/timer", createTimerRoutes());

	return router;
}
