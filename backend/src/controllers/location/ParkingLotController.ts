import { LocationController, LocationType } from "./LocationController";

export class ParkingLotController extends LocationController {
	protected type: LocationType = "PARKING_LOT";
}
