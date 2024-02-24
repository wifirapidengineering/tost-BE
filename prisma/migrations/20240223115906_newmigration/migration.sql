/*
  Warnings:

  - You are about to drop the column `Alcohol` on the `BasicInfo` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Match` table. All the data in the column will be lost.
  - You are about to drop the column `user1Id` on the `Match` table. All the data in the column will be lost.
  - Added the required column `alcohol` to the `BasicInfo` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `language` on the `BasicInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `relationshipStatus` on the `BasicInfo` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `profile1Id` to the `Match` table without a default value. This is not possible if the table is not empty.
  - Added the required column `profile2Id` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('SINGLE', 'MARRIED', 'DIVORCED', 'WIDOWED', 'SEPARATED', 'OTHER');

-- CreateEnum
CREATE TYPE "Language" AS ENUM ('ENGLISH', 'SPANISH', 'FRENCH', 'GERMAN', 'ITALIAN', 'PORTUGUESE', 'RUSSIAN', 'CHINESE', 'JAPANESE', 'KOREAN', 'ARABIC', 'HINDI', 'BENGALI', 'URDU', 'PUNJABI', 'TAMIL', 'TELUGU', 'MARATHI', 'GUJARATI', 'KANNADA', 'MALAYALAM', 'OTHER');

-- DropForeignKey
ALTER TABLE "Match" DROP CONSTRAINT "Match_user1Id_fkey";

-- AlterTable
ALTER TABLE "BasicInfo" DROP COLUMN "Alcohol",
ADD COLUMN     "alcohol" BOOLEAN NOT NULL,
DROP COLUMN "language",
ADD COLUMN     "language" "Language" NOT NULL,
DROP COLUMN "relationshipStatus",
ADD COLUMN     "relationshipStatus" "Status" NOT NULL;

-- AlterTable
ALTER TABLE "Match" DROP COLUMN "status",
DROP COLUMN "user1Id",
ADD COLUMN     "profile1Id" TEXT NOT NULL,
ADD COLUMN     "profile2Id" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profile" ADD COLUMN     "matches" TEXT[];

-- CreateTable
CREATE TABLE "Like" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Like_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Like" ADD CONSTRAINT "Like_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_profile1Id_fkey" FOREIGN KEY ("profile1Id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Match" ADD CONSTRAINT "Match_profile2Id_fkey" FOREIGN KEY ("profile2Id") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
