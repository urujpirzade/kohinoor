-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "bookingBy" TEXT,
ADD COLUMN     "catering" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "decoration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "kitchen" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reference" TEXT,
ADD COLUMN     "secondHall" BOOLEAN NOT NULL DEFAULT false;
