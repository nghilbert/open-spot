import express from "express";
import cookieParser from "cookie-parser";
import createRoutes from "./routes";

export function createExpressApp() {
	const expressApp = express();
	expressApp.use(express.json());
	expressApp.use(express.urlencoded({ extended: true }));
	expressApp.use(cookieParser());

	expressApp.use("/api", createRoutes());
	return expressApp;
}
