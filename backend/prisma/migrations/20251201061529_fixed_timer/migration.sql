-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Timer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME,
    "status" TEXT NOT NULL,
    CONSTRAINT "Timer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Timer_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Timer" ("endTime", "id", "locationId", "startTime", "status", "userId") SELECT "endTime", "id", "locationId", "startTime", "status", "userId" FROM "Timer";
DROP TABLE "Timer";
ALTER TABLE "new_Timer" RENAME TO "Timer";
CREATE UNIQUE INDEX "Timer_userId_key" ON "Timer"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
