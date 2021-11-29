/*
  Warnings:

  - You are about to drop the `JobType` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Job" DROP CONSTRAINT "Job_jobTypeId_fkey";

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "job_type" TEXT;

-- DropTable
DROP TABLE "JobType";
