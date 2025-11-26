import type { Address } from "./address"; // adjust import path as needed

export type LocationType = "PARKING_LOT" | "BIKE_RACK" | "NONE";

export type Location = {
	id: number;
	name: string;
	spotCapacity: number;
	spotAvailability: number;
	type: LocationType;
	address: Address;
};
