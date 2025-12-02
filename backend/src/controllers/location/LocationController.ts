import { Permit, Address, Location } from "@prisma/client";
import { prismaClient } from "../../prismaClient";
import { Prisma, Type } from "@prisma/client";
type LocationAddress = Prisma.LocationGetPayload<{ include: { address: true } }>;
type UpdateLocationInput = Omit<Prisma.LocationUpdateInput, "id">;

export class LocationController {
	protected type: Type = "NONE";

	async add(address: Address, spotCapacity: number, name?: string, timeLimitSecs?: number): Promise<boolean> {
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

	async getLocation(currentId: number): Promise<LocationAddress | null> {
		const location = await prismaClient.location.findUnique({
			where: { id: currentId },
			include: { address: true },
		});
		return location;
	}

	async updateLocation(id: number, locationUpdates: UpdateLocationInput): Promise<boolean> {
		// @ts-ignore
		delete locationUpdates.id;

		try {
			await prismaClient.location.update({
				where: { id },
				data: locationUpdates,
			});
			return true;
		} catch (error) {
			console.error("Failed to update location:", error);
			return false;
		}
	}
}
