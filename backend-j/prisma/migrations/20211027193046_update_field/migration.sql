/*
  Warnings:

  - You are about to drop the column `job_type` on the `Job` table. All the data in the column will be lost.
  - Added the required column `jobTypeId` to the `Job` table without a default value. This is not possible if the table is not empty.
  - Added the required column `reference_id` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" DROP COLUMN "job_type",
ADD COLUMN     "jobTypeId" TEXT NOT NULL,
ADD COLUMN     "reference_id" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "JobType" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "JobType_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_jobTypeId_fkey" FOREIGN KEY ("jobTypeId") REFERENCES "JobType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
