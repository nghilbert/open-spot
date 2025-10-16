// Libraries
import express from "express";
import { AccountController } from "./AccountController";
import { PrismaClient } from "@prisma/client";

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

	// User testing routes
	app.post("/api/user/create", async (req, res) => {
		// Create a user with the account manager
		let data = req.body;
		let name: string = data.name;
		let email: string = data.email;
		let password: string = data.password;

		if(await accountController.createAccount(email, password, name)){
			// Successful creation
			res.status(200).end();
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

		let sessionToken = await accountController.login(email, password);

		if(sessionToken){
			// Successful creation
			res.status(200).json({
				sessionToken
			});
		} else {
			// Send an error
			res.status(400).json({
				sessionToken: null
			});
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