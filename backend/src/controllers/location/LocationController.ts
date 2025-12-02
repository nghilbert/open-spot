import { Address, Location } from "@prisma/client";
import { prismaClient } from "../../prismaClient";
import { Prisma, Type } from "@prisma/client";
type LocationAddress = Prisma.LocationGetPayload<{ include: { address: true } }>;
type UpdateLocationInput = Omit<Prisma.LocationUpdateInput, "id">;

export class LocationController {
	async add(
		address: Address,
		type: Type,
		spotCapacity: number,
		name?: string,
		timeLimitSecs?: number
	): Promise<boolean> {
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
					type: type,
					address: { create: address },
					timeLimitSecs: timeLimitSecs ?? null,
					name: name ?? "no_name",
				},
			});
		} catch (error) {
			console.error("Failed to create a location:\n", error);
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
			// Delete related timers
			await prismaClient.timer.deleteMany({
				where: { locationId: id }
			});

			// Delete historical timers
			await prismaClient.historicalTimes.deleteMany({
				where: { locationId: id }
			});

			// Then delete location
			await prismaClient.location.delete({
				where: { id: id }
			});
		} catch (error) {
			console.error("Failed to remove a location:\n", error);
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
			console.error("Failed to get locations:\n", error);
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
			console.error("Failed to update location:\n", error);
			return false;
		}
	}
}
