import { Router } from "express";
import createUserRoutes from "./user.routes";
import createEmailRoutes from "./email.routes";

export default function createRoutes() {
	const router = Router();

	console.log("Mounting /api/user routes...");
	router.use("/user", createUserRoutes());

	console.log("Mounting /api/email routes...");
	router.use("/email", createEmailRoutes());

	return router;
}
