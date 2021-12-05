import type { Job, PrismaClient } from "@prisma/client";
import { convertMinMax, extractDuplicate, isByKeywords, isByResult } from "../helpers/jobs";
import { IGetJobResult, IGetJobTypeResult, IJobs, IQueryMinMax, ISearchResult, ISearchTypeResult, IShowResultJobTypes } from "../types/types";

export async function getJobTypes(db: PrismaClient): Promise<IShowResultJobTypes> {
  try {
    const jobTypes = await db.job.findMany({
      select: {
        job_type: true,
        salary: true,
      },
      orderBy: {
        job_type: 'asc'
      }
    });

    const jobs = extractDuplicate(jobTypes);
    const filteredJobs = convertMinMax((jobTypes) as Job[]);

    return jobs;
  } catch (err) {
    throw new Error("Error when running query" + err);
  }
}

export async function getJobType({ db, type, min, max }: IGetJobTypeResult): Promise<IJobs[]> {
  try {
    const jobType: Job[] = await db.job.findMany({
      where: {
        job_type: type
      }
    })
    const filteredJobs: IJobs[] = convertMinMax((jobType as Job[]));
    const newJobs: IJobs[] = queryMinMax({ filteredJobs, min: (min as number | null), max: (max as number | null) })
    return newJobs;
  } catch (error) {
    throw new Error("Error while running query " + error)
  }
}

export async function getJob({ db, id }: IGetJobResult): Promise<Job> {
  try {
    const job: Job = await db.job.findUnique({
      where: {
        id: Number(id)
      }
    })

    return job;
  } catch (error) {
    throw new Error("Error while running query " + error)
  }
}

export async function getAllJobs({ db }: { db: PrismaClient }): Promise<IJobs[]> {
  try {
    const allJobs = await db.job.findMany({});
    const filteredJobs = convertMinMax((allJobs as Job[]));
    
    return filteredJobs;
  } catch (error) {
    throw new Error(`Error while running query ` + error)
  }
}

export async function search({ db, keywordType, keyword, byResult, take, min, max }: ISearchTypeResult): Promise<ISearchResult> {
  try {
    const result: Job[] = await db.job.findMany({
      ...isByResult({ byResult }),
      where: {
        ...isByKeywords(keywordType, keyword),
      },
      take: 20 + take,
    });

    if (byResult == 'all') {
      const filteredJobs: IJobs[] = convertMinMax((result as Job[]));
      const newJobs: IJobs[] = queryMinMax({ filteredJobs, min: (min as number | null), max: (max as number | null) })

      return newJobs;
    }

    return result
  } catch (error) {
    throw new Error("Error when running query" + error);
  }
}

export function queryMinMax({ filteredJobs, min, max }: IQueryMinMax): IJobs[] {
  let result: IJobs[] = [];

  // grab the min and max
  if (min != null && max != null) {
    result = filteredJobs.filter((job) => job.min >= min && job.max <= max);
  }

  // if the max is empty
  else if (min != null && !max) {
    result = filteredJobs.filter(job => job.min >= min)
  }

  // if the min is empty
  else if (max != null && !min) {
    result = filteredJobs.filter(job => job.max <= max)
  }

  // both max and min are null return everthing.
  else if (!max && !min) {
    result = filteredJobs
  }

  return result
}