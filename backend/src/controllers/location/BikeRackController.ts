import { LocationController } from "./LocationController";
import type { LocationType } from "@openspot/shared";

export class BikeRackController extends LocationController {
	protected type: LocationType = "BIKE_RACK";
}
