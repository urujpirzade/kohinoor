/*
  Warnings:

  - Made the column `start_time` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `end_time` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact` on table `Event` required. This step will fail if there are existing NULL values in that column.
  - Made the column `contact` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "start_time" SET NOT NULL,
ALTER COLUMN "end_time" SET NOT NULL,
ALTER COLUMN "contact" SET NOT NULL;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "contact" SET NOT NULL;
