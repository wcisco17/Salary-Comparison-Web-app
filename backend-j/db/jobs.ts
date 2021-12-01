import type { Job, PrismaClient } from "@prisma/client";
import { cleanupSalaries, extractDuplicate, isByKeywords, isByResult } from "../helpers/jobs";
import { ISearchType, IShowResultJobTypes } from "../types/types";

export async function dbShowJobTypes(db: PrismaClient): Promise<IShowResultJobTypes> {
  try {
    const jobTypes = await db.job.findMany({
      select: {
        job_type: true
      },
      orderBy: {
        job_type: 'asc'
      }
    });

    const jobs = extractDuplicate(jobTypes);
    return jobs;
  } catch (err) {
    throw new Error("Error when running query" + err);
  }
}

export async function search({ db, keywordType, keyword, byResult, take }: ISearchType): Promise<Job[] | Array<{ title: string }>> {
  try {
    const result = await db.job.findMany({
      ...isByResult({ byResult }),
      where: {
        ...isByKeywords(keywordType, keyword),

      },
      take: 20 + take,
    });

    return result
  } catch (error) {
    throw new Error("Error when running query" + error);
  }
}

type IFindResults = {
  salaries: {
    min: string[],
    max: string[],
  }
}

export function queryMinMax(jobs: Job[]) {
  let newSalary: string = "";
  let min;
  let max;

  const result = jobs.map(job => {
    // clean up our salaries
    newSalary = cleanupSalaries(job.salary)

    console.log(newSalary)
  })

  return result;
}