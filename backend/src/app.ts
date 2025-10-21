import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import routes from "./routes/index";

export function createApp() {
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());
	app.use("/api", routes);
	return app;
}
