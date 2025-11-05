import { prismaClient } from "../../prismaClient";
import { Address } from "@openspot/shared";

export class BikeRackController {
	async addRack(address: Address, spotCapacity: number, name?: string): Promise<boolean> {
		// Validate arguments
		if (!address || !Number.isInteger(spotCapacity) || spotCapacity <= 0) {
			return false;
		}

		// Create database object
		try {
			await prismaClient.location.create({
				data: {
					spotCapacity: spotCapacity,
					spotAvailability: spotCapacity,
					address: { create: address },
					name: name ?? "no_name",
					type: "BIKE_RACK",
				},
			});
		} catch (error) {
			console.error("Failed to create bike rack: ", error);
			return false;
		}

		return true;
	}
}
