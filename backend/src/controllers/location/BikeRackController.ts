import { LocationController } from "./LocationController";
import { LocationType } from "@openspot/shared";

export class BikeRackController extends LocationController {
	protected type: LocationType = "BIKE_RACK";
}
