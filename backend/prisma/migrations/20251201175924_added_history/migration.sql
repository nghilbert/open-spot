-- CreateTable
CREATE TABLE "HistoricalTimes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "locationId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    CONSTRAINT "HistoricalTimes_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    CONSTRAINT "Location_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "Address" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Location" ("addressId", "id", "name", "permit", "spotAvailability", "spotCapacity", "timeLimitSecs", "type") SELECT "addressId", "id", "name", "permit", "spotAvailability", "spotCapacity", "timeLimitSecs", "type" FROM "Location";
DROP TABLE "Location";
ALTER TABLE "new_Location" RENAME TO "Location";
CREATE UNIQUE INDEX "Location_addressId_key" ON "Location"("addressId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
