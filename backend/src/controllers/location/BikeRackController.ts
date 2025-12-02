import { LocationController } from "./LocationController";
import type { Type } from "@prisma/client";

export class BikeRackController extends LocationController {
	protected type: Type = "BIKE_RACK";
}
