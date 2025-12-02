-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_HistoricalTimes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "locationId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    CONSTRAINT "HistoricalTimes_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_HistoricalTimes" ("endTime", "id", "locationId", "startTime") SELECT "endTime", "id", "locationId", "startTime" FROM "HistoricalTimes";
DROP TABLE "HistoricalTimes";
ALTER TABLE "new_HistoricalTimes" RENAME TO "HistoricalTimes";
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
CREATE TABLE "new_Timer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "status" TEXT NOT NULL,
    CONSTRAINT "Timer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Timer_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Timer" ("endTime", "id", "locationId", "startTime", "status", "userId") SELECT "endTime", "id", "locationId", "startTime", "status", "userId" FROM "Timer";
DROP TABLE "Timer";
ALTER TABLE "new_Timer" RENAME TO "Timer";
CREATE UNIQUE INDEX "Timer_userId_key" ON "Timer"("userId");
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "PasswordID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'NONE',
    "permit" TEXT NOT NULL DEFAULT 'NONE',
    "userType" TEXT NOT NULL DEFAULT 'NONE',
    "createdOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_PasswordID_fkey" FOREIGN KEY ("PasswordID") REFERENCES "Password" ("passwordId") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_User" ("PasswordID", "createdOn", "email", "emailVerified", "id", "name", "permit", "role", "userType", "username") SELECT "PasswordID", "createdOn", "email", "emailVerified", "id", "name", "permit", "role", "userType", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_PasswordID_key" ON "User"("PasswordID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
