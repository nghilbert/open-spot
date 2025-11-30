import { User } from "./user";

export interface Password {
	passwordId: String;
	passwordHash?: String;
	createdOn: Date;

	user?: User;
	userOld?: User[];
}
