-- CreateEnum
CREATE TYPE "Status" AS ENUM ('Pending', 'Accepted', 'Withdrawn');

-- CreateTable
CREATE TABLE "Card" (
    "tokenId" INTEGER NOT NULL,
    "owner" TEXT NOT NULL,
    "metadataURI" TEXT NOT NULL,
    "name" TEXT,
    "description" TEXT,
    "image" TEXT,
    "sport" TEXT,
    "rarity" TEXT,
    "series" TEXT,
    "edition" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Card_pkey" PRIMARY KEY ("tokenId")
);

-- CreateTable
CREATE TABLE "Listing" (
    "id" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "seller" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "encryptedPriceHandle" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Offer" (
    "id" TEXT NOT NULL,
    "tokenId" INTEGER NOT NULL,
    "buyer" TEXT NOT NULL,
    "seller" TEXT NOT NULL,
    "encryptedAmountHandle" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Offer_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Listing_tokenId_key" ON "Listing"("tokenId");

-- CreateIndex
CREATE UNIQUE INDEX "Offer_tokenId_buyer_key" ON "Offer"("tokenId", "buyer");

-- AddForeignKey
ALTER TABLE "Listing" ADD CONSTRAINT "Listing_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Card"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Offer" ADD CONSTRAINT "Offer_tokenId_fkey" FOREIGN KEY ("tokenId") REFERENCES "Card"("tokenId") ON DELETE RESTRICT ON UPDATE CASCADE;
