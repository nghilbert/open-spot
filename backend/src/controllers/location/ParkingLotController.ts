import { LocationController } from "./LocationController";
import type { LocationType } from "@openspot/shared";

export class ParkingLotController extends LocationController {
	protected type: LocationType = "PARKING_LOT";
}
