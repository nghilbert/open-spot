import { prismaClient } from "../../prismaClient";

export class ParkingLotController {
	async addParkingLot(address: string, spotCapacity: number, name: string): Promise<Boolean> {
		if (!address || !Number.isInteger(spotCapacity)) {
			return false;
		}

		await prismaClient.location.create({
			data: {
				address: address,
				spotCapacity: spotCapacity,
				spotAvailability: spotCapacity,
				name: name,
			},
		});

		return true;
	}
}
