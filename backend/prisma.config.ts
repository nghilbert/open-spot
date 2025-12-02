import { defineConfig } from "prisma/config";
import "dotenv/config";

export default defineConfig({
	schema: "./prisma/schema/",
	migrations: { path: "./prisma/migrations" },
	datasource: {
		url: process.env.DATABASE_URL || 'file:./prisma/schema/dev.db'
	}
});
