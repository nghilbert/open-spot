import { Router } from "express";
import createUserRoutes from "./user.routes";

export default function createRoutes(controllers: any) {
	const router = Router();
	router.use("/user", createUserRoutes(controllers));
	return router;
}
