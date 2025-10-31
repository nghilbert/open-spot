import { Request, Response, NextFunction } from "express";

export function checkAdmin(req: Request, res: Response, next: NextFunction) {
	if (!req.user || req.user.role !== "ADMIN") {
		return res.status(403).json({ error: "Forbidden" });
	}
	next();
}
