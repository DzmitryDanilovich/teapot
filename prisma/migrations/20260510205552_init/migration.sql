-- CreateTable
CREATE TABLE "Tea" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "origin" TEXT,
    "storeUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tea_pkey" PRIMARY KEY ("id")
);
