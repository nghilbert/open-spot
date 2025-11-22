import { Request, Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../types/authenticatedRequest";

// This middleware must always be chained after requestAuth
export async function verifyAdmin(req: Request, res: Response, next: NextFunction) {
	const user = (req as unknown as AuthenticatedRequest).user;

	if (!user || user.role !== "ADMIN") {
		return res.status(403).json({ error: "Forbidden" });
	}

	next();
}
