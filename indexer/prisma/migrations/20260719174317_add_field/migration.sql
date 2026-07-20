/*
  Warnings:
  - Added the required column `encryptedForSeller` to the `Offer` table.
  - Applied as: add nullable, backfill, then enforce NOT NULL (safe for non-empty tables).
*/

-- AlterTable: add as nullable first
ALTER TABLE "Offer" ADD COLUMN "encryptedForSeller" TEXT;

-- Backfill existing rows with a placeholder
UPDATE "Offer" SET "encryptedForSeller" = '' WHERE "encryptedForSeller" IS NULL;

-- Enforce NOT NULL now that all rows have a value
ALTER TABLE "Offer" ALTER COLUMN "encryptedForSeller" SET NOT NULL;
