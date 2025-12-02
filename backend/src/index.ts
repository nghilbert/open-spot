import { prismaClient } from "./prismaClient";
import { createExpressApp } from "./app";
import { timerController } from "./controllers";

// Runtime config
const environment = process.env.NODE_ENV || "development";
const port = parseInt(process.env.PORT || "5001", 10);

// Create a main function for lifetime handling
async function main() {
	const app = createExpressApp();
	await timerController.initTimersFromDB();

	let server = app.listen(port, () => {
		console.log(`Listening on port ${port}`);
	});

	// Graceful shutdown
	process.on("SIGINT", async () => {
		console.log("Disconnecting Prisma...");
		await prismaClient.$disconnect();
		server.close(() => process.exit(0));
	});
}

main().catch(async (err) => {
	console.error("Startup failed:", err);
	process.exit(1);
});
