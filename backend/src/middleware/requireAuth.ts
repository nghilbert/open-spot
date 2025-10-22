import { Request, Response, NextFunction } from "express";
import { accountController } from "../controllers/index";
import { AuthenticatedRequest } from "../types/authenticatedRequest";

// Create middleware for securing with session tokens
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
	const sessionToken = (req as any).cookies?.session;

	if (!sessionToken) {
		return res.status(401).json({ error: "Not authenticated" });
	}

	const session = await accountController.getUserSession(sessionToken);

	if (!session) {
		return res.status(401).json({ error: "Session expired" });
	}

	// Attach user info for downstream handlers
	(req as unknown as AuthenticatedRequest).user = session;
	next();
}
