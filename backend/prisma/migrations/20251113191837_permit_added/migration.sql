-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL DEFAULT '',
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "PasswordID" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'NONE',
    "permit" TEXT NOT NULL DEFAULT 'NONE',
    "createdOn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_PasswordID_fkey" FOREIGN KEY ("PasswordID") REFERENCES "Password" ("passwordId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_User" ("PasswordID", "createdOn", "email", "emailVerified", "id", "name", "role", "username") SELECT "PasswordID", "createdOn", "email", "emailVerified", "id", "name", "role", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
CREATE UNIQUE INDEX "User_PasswordID_key" ON "User"("PasswordID");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
