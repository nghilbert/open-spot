-- CreateTable
CREATE TABLE "Location" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "address" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "spotCapacity" INTEGER NOT NULL,
    "spotAvailability" INTEGER NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'NONE'
);

-- CreateIndex
CREATE UNIQUE INDEX "Location_address_key" ON "Location"("address");
