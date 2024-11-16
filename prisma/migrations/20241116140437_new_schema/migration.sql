/*
  Warnings:

  - You are about to drop the column `date` on the `Appointment` table. All the data in the column will be lost.
  - You are about to drop the column `time` on the `Appointment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[dateTime]` on the table `Appointment` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `dateTime` to the `Appointment` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Appointment_date_time_key";

-- AlterTable
ALTER TABLE "Appointment" DROP COLUMN "date",
DROP COLUMN "time",
ADD COLUMN     "dateTime" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_dateTime_key" ON "Appointment"("dateTime");
