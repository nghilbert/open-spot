import { LocationController } from "./LocationController";
import type { Type } from "@prisma/client";

export class ParkingLotController extends LocationController {
	protected type: Type = "PARKING_LOT";
}
