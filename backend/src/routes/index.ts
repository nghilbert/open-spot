import { Router } from "express";
import createUserRoutes from "./user.routes";

export default function createRoutes() {
	const router = Router();
	router.use("/user", createUserRoutes());
	return router;
}
