import type { User, Session } from "@prisma/client";

declare global {
	namespace Express {
		interface Request {
			user?: User;
			session?: Session;
		}
	}
}

import type { User } from "@prisma/client";

declare global {
	namespace Express {
		interface Request {
			user?: User;
			session?: Session;
		}
	}
}
