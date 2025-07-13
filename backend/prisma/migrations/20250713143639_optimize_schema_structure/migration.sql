/*
  Warnings:

  - You are about to drop the column `about` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `alcoholUsage` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `cleanlinessLevel` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `eatingPreference` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `guestHost` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `languageSpoken` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `partyPerson` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `personality` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `petOwner` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `saturdayVibe` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `smokeDrink` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `smoker` on the `users` table. All the data in the column will be lost.
  - The `cleanliness` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `moveInDate` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "about",
DROP COLUMN "alcoholUsage",
DROP COLUMN "cleanlinessLevel",
DROP COLUMN "eatingPreference",
DROP COLUMN "guestHost",
DROP COLUMN "languageSpoken",
DROP COLUMN "location",
DROP COLUMN "partyPerson",
DROP COLUMN "personality",
DROP COLUMN "petOwner",
DROP COLUMN "saturdayVibe",
DROP COLUMN "smokeDrink",
DROP COLUMN "smoker",
ADD COLUMN     "drinkingHabits" TEXT,
ADD COLUMN     "hostingStyle" TEXT,
ADD COLUMN     "languagesSpoken" TEXT[],
ADD COLUMN     "petOwnership" TEXT,
ADD COLUMN     "smokingHabits" TEXT,
ADD COLUMN     "socialStyle" TEXT,
ADD COLUMN     "weekendStyle" TEXT,
DROP COLUMN "cleanliness",
ADD COLUMN     "cleanliness" INTEGER NOT NULL DEFAULT 3,
DROP COLUMN "moveInDate",
ADD COLUMN     "moveInDate" TIMESTAMP(3);
