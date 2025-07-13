/*
  Warnings:

  - You are about to drop the column `sleepTime` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `wakeUpTime` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "sleepTime",
DROP COLUMN "wakeUpTime",
ADD COLUMN     "sleepPattern" TEXT;
