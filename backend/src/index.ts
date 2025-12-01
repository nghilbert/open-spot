import { prismaClient } from "./prismaClient";
import { createExpressApp } from "./app";
import { accountController, locationController, timerController } from "./controllers";
import { Address, Location } from "@openspot/shared";

// Runtime config
const environment = process.env.NODE_ENV || "development";
const port = parseInt(process.env.PORT || "5001", 10);

// Create a main function for lifetime handling
async function main() {
	const app = createExpressApp();
	await timerController.initTimersFromDB();

	const test = async () => {
		// let loc: Address = { number: 0, street: "100 South Fell", city: "normal", state: "il", zip: 61761};
		// await locationController.add(loc, 10, "Test lot", 1000);

		const loc = await locationController.getLocation(1) as Location|null;
		const user = await prismaClient.user.findUnique({ where: { id: 2 }});
		console.log(await timerController.startTimer(user!, loc!, 5));
	}
	test();

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
