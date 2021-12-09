import type { Job } from "@prisma/client";
// import { prismaMock } from "./index.test";
// import { createJob } from "./job/jobs.test";

test("should create new job", async () => {
  const job: Job = {
    id: 12323,
    title: "Demo job prisma",
    company_name: "Company Demo",
    salary: "$120,000",
    job_type: "Other",
    short_description: "Short desc",
    experience: "Great",
    websiteId: 1,
    location: "London",
    url: "job.com",
    logo: "job-logo.png",
    reference_id: "",
    summary: ""
  }

  // prismaMock.job.create.mockResolvedValue(job);

  // await expect(createJob(job), {}).resolves.toEqual({

  // })
})