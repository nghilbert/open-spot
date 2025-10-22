// Libraries
import { AccountController } from "./controllers/AccountController";
import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { createApp } from "./app";
import { createControllers } from "./controllers/index";
// Runtime config
const environment = process.env.NODE_ENV || "development";
const port = parseInt(process.env.PORT || "5001", 10);

// Create a main function for lifetime handling
async function main() {
	const prisma = new PrismaClient();
	const controllers = createControllers(prisma);
	const app = createApp(controllers);

	let server = app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});

	// Graceful shutdown
	process.on("SIGINT", async () => {
		console.log("Disconnecting Prisma...");
		await prisma.$disconnect();
		server.close(() => process.exit(0));
	});
}

main().catch(async (err) => {
	console.error("Startup failed:", err);
	process.exit(1);
});

// // Create middleware for securing with session tokens
// interface AuthenticatedRequest extends Request {
// 	user: User;
// }

// // User testing routes
// app.post("/api/user/create", async (req, res) => {
// 	// Create a user with the account manager
// 	let data = req.body;
// 	let name: string = data.name;
// 	let email: string = data.email;
// 	let password: string = data.password;

// 	if (await accountController.createAccount(email, password, name)) {
// 		// Successful creation
// 		res.status(200).redirect("/");
// 	} else {
// 		// Send an error
// 		res.status(400).end();
// 	}
// });

// app.post("/api/user/logout", requireAuth, async (req, res) => {
// 	// Ask the account manager to log the user out
// 	const sessionToken = (req as any).cookies?.session;

// 	if (sessionToken) {
// 		// Successful
// 		accountController.logout(sessionToken);
// 		res.status(200).end();
// 	} else {
// 		// Send an error
// 		res.status(400).end();
// 	}
// });

// app.post("/api/user/exists", async (req, res) => {
// 	// Ask the account manager to log the user in
// 	let data = req.body;
// 	let email: string = data.email;

// 	let exists = await accountController.emailExists(email);

// 	if (exists) {
// 		// Successful creation
// 		res.status(200).end();
// 	} else {
// 		// Send an error
// 		res.status(400).end();
// 	}
// });

// app.get("/api/user/name", requireAuth, async (req, res) => {
// 	// Ask the account manager to log the user in
// 	res.end((req as AuthenticatedRequest).user.name);
// });

// app.get("/api/test", async (req, res) => {
// 	res.end("Hello from the server!");
// });
