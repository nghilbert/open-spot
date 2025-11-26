import { prismaClient } from "../../prismaClient";
import { Address, LocationType } from "@openspot/shared";

export abstract class LocationController {
	protected abstract type: LocationType;

	async addLocation(address: Address, spotCapacity: number, name?: string): Promise<boolean> {
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
					type: this.type,
				},
			});
		} catch (error) {
			console.error(`Failed to create a location of type ${this.type.toLowerCase()}:`, error);
			return false;
		}

		return true;
	}
}
