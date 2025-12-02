-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "addressId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "spotCapacity" INTEGER NOT NULL,
    "spotAvailability" INTEGER NOT NULL,
    "permit" TEXT NOT NULL DEFAULT 'NONE',
    "type" TEXT NOT NULL DEFAULT 'NONE',
    "timeLimitSecs" INTEGER,
    "averageParkingTime" INTEGER NOT NULL DEFAULT 0,
    CONSTRAINT "Location_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Location" ("addressId", "averageParkingTime", "id", "name", "permit", "spotAvailability", "spotCapacity", "timeLimitSecs", "type") SELECT "addressId", "averageParkingTime", "id", "name", "permit", "spotAvailability", "spotCapacity", "timeLimitSecs", "type" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE UNIQUE INDEX "Location_addressId_key" ON "Location"("addressId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
