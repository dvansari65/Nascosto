/*
  Warnings:

  - Changed the type of `status` on the `Listing` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `status` on the `Offer` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "OfferStatus" AS ENUM ('Pending', 'Accepted', 'Withdrawn');

-- CreateEnum
CREATE TYPE "ListingStatus" AS ENUM ('Listed', 'Sold', 'Delisted');

-- AlterTable
ALTER TABLE "Listing" DROP COLUMN "status",
ADD COLUMN     "status" "ListingStatus" NOT NULL;

-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "status",
ADD COLUMN     "status" "OfferStatus" NOT NULL;

-- DropEnum
DROP TYPE "Status";
