-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Verify" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "token" TEXT NOT NULL,
    "userID" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Verify" ("id", "token", "userID") SELECT "id", "token", "userID" FROM "Verify";
DROP TABLE "Verify";
ALTER TABLE "new_Verify" RENAME TO "Verify";
CREATE UNIQUE INDEX "Verify_token_key" ON "Verify"("token");
CREATE INDEX "Verify_token_idx" ON "Verify"("token");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
