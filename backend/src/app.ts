import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import createRoutes from "./routes/index";
import { Controllers } from "./types/controllers";

export function createApp(controllers: Controllers) {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());

	app.use("/api", createRoutes(controllers));
	return app;
}
