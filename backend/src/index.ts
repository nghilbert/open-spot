// Libraries
import express, { Request, Response, NextFunction } from "express";
import { AccountController } from "./AccountController";
import { PrismaClient } from "@prisma/client";
import { User } from "@openspot/shared";
import cookieParser from "cookie-parser";

// Runtime config
const environment = process.env.NODE_ENV || "development";
const port = parseInt(process.env.PORT || "5001", 10);

// Create a main function for lifetime handling
async function main(){
	// Setup account manager and DB
	const prisma = new PrismaClient();
	const accountController = new AccountController(prisma);

	// Setup server
	const app = express();
	app.use(express.json());
	app.use(express.urlencoded({ extended: true }));
	app.use(cookieParser());

	// Create middleware for securing with session tokens
	interface AuthenticatedRequest extends Request {
		user: User;
	}

	async function requireAuth(req: Request, res: Response, next: NextFunction){
		const token = (req as any).cookies?.session;

		if(!token){
			return res.status(401).json({ error: "Not authenticated" });
		}

		const session = await accountController.getUserSession(token);

		if(!session){
			return res.status(401).json({ error: "Session expired" });
		}

		// Attach user info for downstream handlers
		(req as AuthenticatedRequest).user = session;
		next();
	}

	// User testing routes
	app.post("/api/user/create", async (req, res) => {
		// Create a user with the account manager
		let data = req.body;
		let name: string = data.name;
		let email: string = data.email;
		let password: string = data.password;

		if(await accountController.createAccount(email, password, name)){
			// Successful creation
			res.status(200).redirect("/");
		} else {
			// Send an error
			res.status(400).end();
		}
	});

	app.post("/api/user/login", async (req, res) => {
		// Ask the account manager to log the user in
		let data = req.body;
		let email: string = data.email;
		let password: string = data.password;

		if(!email || !password){
			return res.status(400).json({ error: "Missing email or password" });
		}

		let sessionToken = await accountController.login(email, password);

		if(sessionToken){
			// Successful creation
			res.cookie("session", sessionToken, {
				httpOnly: true,
				secure: false,
				sameSite: "lax"
			});

			res.status(200).end();
		} else {
			// Send an error
			res.status(400).end();
		}
	});

	app.post("/api/user/exists", async (req, res) => {
		// Ask the account manager to log the user in
		let data = req.body;
		let email: string = data.email;

		let exists = await accountController.emailExists(email);

		if(exists){
			// Successful creation
			res.status(200).end();
		} else {
			// Send an error
			res.status(400).end();
		}
	});

	app.get("/api/user/name", requireAuth, async (req, res) => {
		// Ask the account manager to log the user in
		res.end((req as AuthenticatedRequest).user.name);
	});

	app.get("/api/test", async (req, res) => {
		res.end("Hello from the server!");
	});

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