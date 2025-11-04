import { Router } from "express";
import createUserRoutes from "./user.routes";
import createEmailRoutes from "./email.routes";
import createLotRoutes from "./lot.routes";
import createRackRoutes from "./rack.routes";

export default function createRoutes() {
	const router = Router();

	console.log("Mounting /api/user routes...");
	router.use("/user", createUserRoutes());

	console.log("Mounting /api/email routes...");
	router.use("/email", createEmailRoutes());

	console.log("Mounting /api/lot routes...");
	router.use("/lot", createLotRoutes());

	console.log("Mounting /api/rack routes...");
	router.use("/rack", createRackRoutes());
	return router;
}
