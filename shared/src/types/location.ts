import type { Address } from "./address";

export type LocationType = "PARKING_LOT" | "BIKE_RACK" | "NONE";
export type Permit = "COMMUTER" | "EMPLOYEE" | "GARAGE" | "NONE";

export type Location = {
	id: number;
	name: string;
	spotCapacity: number;
	spotAvailability: number;
	permit: Permit;
	type: LocationType;
	address: Address;
	timeLimitSecs: number | null;
};
