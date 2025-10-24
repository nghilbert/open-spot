import { Router } from "express";
import createUserRoutes from "./user.routes";

export default function createRoutes() {
	const router = Router();
	console.log("Mounting /api/user routes...");
	router.use("/user", createUserRoutes());
	return router;
}
