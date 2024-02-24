/*
  Warnings:

  - You are about to drop the column `isArchived` on the `Profile` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `Profile` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Profile" DROP COLUMN "isArchived",
DROP COLUMN "isVerified";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isArchived" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isVerified" BOOLEAN NOT NULL DEFAULT false;
