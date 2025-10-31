import { prismaClient } from "../../prismaClient";
import { Address } from "@openspot/shared";

export class ParkingLotController {
	async addLot(address: Address, spotCapacity: number, name?: string): Promise<boolean> {
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
					type: "PARKING_LOT",
				},
			});
		} catch (error) {
			console.error("Failed to create parking lot: ", error);
			return false;
		}

		return true;
	}
}
