import { User } from "@openspot/shared";

export interface AuthenticatedRequest extends Request {
	user?: User;
}
