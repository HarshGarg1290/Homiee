-- AlterTable
ALTER TABLE "users" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "alcoholUsage" TEXT,
ADD COLUMN     "bio" TEXT,
ADD COLUMN     "cleanlinessLevel" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "dietaryPrefs" TEXT,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "interests" TEXT[],
ADD COLUMN     "languageSpoken" TEXT[],
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "moveInDate" TEXT,
ADD COLUMN     "musicGenres" TEXT[],
ADD COLUMN     "partyPerson" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "personalityType" TEXT,
ADD COLUMN     "petOwner" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "petPreference" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "sleepTime" TEXT,
ADD COLUMN     "smoker" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "sportsActivities" TEXT[],
ADD COLUMN     "wakeUpTime" TEXT;
