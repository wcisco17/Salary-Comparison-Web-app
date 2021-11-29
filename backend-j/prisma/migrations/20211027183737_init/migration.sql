-- CreateEnum
CREATE TYPE "SitesType" AS ENUM ('REMOTEOK', 'MONSTER', 'INDEED', 'GLASSDOOR', 'ANGELCO');

-- CreateTable
CREATE TABLE "Website" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "logo" TEXT NOT NULL,
    "type" "SitesType" NOT NULL,

    CONSTRAINT "Website_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Job" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "salary" TEXT NOT NULL,
    "company_name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "websiteId" TEXT,
    "location" TEXT,
    "short_description" TEXT,
    "summary" TEXT,
    "job_type" TEXT NOT NULL,
    "experience" TEXT,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Job" ADD CONSTRAINT "Job_websiteId_fkey" FOREIGN KEY ("websiteId") REFERENCES "Website"("id") ON DELETE SET NULL ON UPDATE CASCADE;
