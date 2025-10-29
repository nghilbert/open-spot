import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";
const prismaClient = new PrismaClient();

export async function verifyAdmin(req: Request, res: Response, next: NextFunction) {
	const sessionToken = req.body.sessionToken;

	const session = await prismaClient.session.findUnique({
		where: { sessionToken: sessionToken },
		include: { user: true },
	});

	if (!session?.user || session.user.role !== "ADMIN") {
		return res.status(403).json({ error: "Forbidden" });
	}

	next();
}
