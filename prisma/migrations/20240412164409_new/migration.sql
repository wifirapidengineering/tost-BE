/*
  Warnings:

  - The values [VIDEOGAMES] on the enum `Hobby` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `darkMode` on the `AppSettings` table. All the data in the column will be lost.
  - You are about to drop the column `settingsId` on the `Faq` table. All the data in the column will be lost.
  - You are about to drop the column `matchId` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `receiverId` on the `Message` table. All the data in the column will be lost.
  - Added the required column `status` to the `Match` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "MatchType" AS ENUM ('AUTOMATCH', 'MANUALMATCH');

-- AlterEnum
BEGIN;
CREATE TYPE "Hobby_new" AS ENUM ('SPORTS', 'MUSIC', 'ART', 'YOGA', 'KARAOKE', 'TENNIS', 'RUN', 'SWIM', 'EXTREME', 'VIDEOGAMING', 'TRAVEL', 'FOOD', 'MOVIES', 'GAMES', 'READING', 'WRITING', 'DANCING', 'SHOPPING', 'COOKING', 'PHOTOGRAPHY', 'CARS', 'FASHION', 'TECHNOLOGY', 'POLITICS', 'RELIGION', 'CRAFTS', 'DRINK', 'GARDENING', 'ANIMALS', 'NATURE', 'FITNESS', 'HEALTH', 'EDUCATION', 'BUSINESS', 'FINANCE', 'SCIENCE', 'HISTORY', 'CULTURE', 'LANGUAGES', 'OTHER');
ALTER TABLE "Profile" ALTER COLUMN "hobbies" TYPE "Hobby_new"[] USING ("hobbies"::text::"Hobby_new"[]);
ALTER TYPE "Hobby" RENAME TO "Hobby_old";
ALTER TYPE "Hobby_new" RENAME TO "Hobby";
DROP TYPE "Hobby_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "Faq" DROP CONSTRAINT "Faq_settingsId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_matchId_fkey";

-- DropForeignKey
ALTER TABLE "Message" DROP CONSTRAINT "Message_receiverId_fkey";

-- AlterTable
ALTER TABLE "AppSettings" DROP COLUMN "darkMode",
ALTER COLUMN "termsOfUse" DROP NOT NULL,
ALTER COLUMN "privacyPolicy" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Faq" DROP COLUMN "settingsId";

-- AlterTable
ALTER TABLE "Match" ADD COLUMN     "status" "MatchType" NOT NULL;

-- AlterTable
ALTER TABLE "Message" DROP COLUMN "matchId",
DROP COLUMN "receiverId",
ADD COLUMN     "read" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "bio" DROP NOT NULL,
ALTER COLUMN "dateOfBirth" DROP NOT NULL;

-- CreateTable
CREATE TABLE "UserSettings" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "darkMode" BOOLEAN DEFAULT false,
    "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "UserSettings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MessageToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "UserSettings_userId_key" ON "UserSettings"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "_MessageToUser_AB_unique" ON "_MessageToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_MessageToUser_B_index" ON "_MessageToUser"("B");

-- AddForeignKey
ALTER TABLE "UserSettings" ADD CONSTRAINT "UserSettings_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToUser" ADD CONSTRAINT "_MessageToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Message"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MessageToUser" ADD CONSTRAINT "_MessageToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
