/*
  Warnings:

  - You are about to drop the column `duration` on the `Timer` table. All the data in the column will be lost.
  - Added the required column `endTime` to the `Timer` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Timer" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "locationId" INTEGER NOT NULL,
    "startTime" DATETIME NOT NULL,
    "endTime" DATETIME NOT NULL,
    "status" TEXT NOT NULL,
    CONSTRAINT "Timer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Timer_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Timer" ("id", "locationId", "startTime", "status", "userId") SELECT "id", "locationId", "startTime", "status", "userId" FROM "Timer";
DROP TABLE "Timer";
ALTER TABLE "new_Timer" RENAME TO "Timer";
CREATE UNIQUE INDEX "Timer_userId_key" ON "Timer"("userId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
