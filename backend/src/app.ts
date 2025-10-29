import express from "express";
import cookieParser from "cookie-parser";
import createRoutes from "./routes";
import { emailController } from "./controllers";

export function createExpressApp() {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());
	
	app.use("/api", createRoutes());
	return app;
}
