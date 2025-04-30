/*
  Warnings:

  - You are about to drop the column `secondHall` on the `Event` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" DROP COLUMN "secondHall",
ADD COLUMN     "hallHandover" BOOLEAN NOT NULL DEFAULT false;
