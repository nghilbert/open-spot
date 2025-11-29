import { Permit, Type } from "@prisma/client";
import { prismaClient } from "../../prismaClient";
import type { Location, Address, LocationType } from "@openspot/shared";

export class LocationController {
	protected type: LocationType = "NONE";

	async add(address: Address, spotCapacity: number, name?: string): Promise<boolean> {
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

	async remove(id: number): Promise<boolean> {
		// Validate arguments
		if (!id || !Number.isInteger(id)) {
			return false;
		}

		// Remove database object
		try {
			await prismaClient.location.delete({ where: { id } });
		} catch (error) {
			console.error(`Failed to remove a location of type ${this.type.toLowerCase()}:`, error);
			return false;
		}

		return true;
	}

	async getAll(): Promise<Location[]> {
		try {
			const locations = await prismaClient.location.findMany({
				include: { address: true },
			});
			return locations;
		} catch (error) {
			console.error("Failed to get locations: ", error);
			return [];
		}
	}

	async getLocation(currentId: number): Promise<(Location & { address: Address }) | null> {
		const location = await prismaClient.location.findUnique({
			where: { id: currentId },
			include: { address: true },
		});
		return location;
	}

	async updateLocation(
		currentId: number,
		number: number,
		street: string,
		city: string,
		state: string,
		zip: number,
		name: string,
		spotCapacity: number,
		spotAvailability: number,
		permit: Permit,
		type: Type
	): Promise<boolean> {
		try {
			await prismaClient.location.update({
				where: { id: currentId },
				data: {
					address: {
						update: {
							number: number,
							street: street,
							city: city,
							state: state,
							zip: zip,
						},
					},
					name: name,
					spotCapacity: spotCapacity,
					spotAvailability: spotAvailability,
					permit: permit,
					type: type,
				},
			});
			return true;
		} catch {
			return false;
		}
	}
}
