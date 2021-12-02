import type { Job, PrismaClient } from "@prisma/client";
import { cleanupSalaries, extractDuplicate, isByKeywords, isByResult } from "../helpers/jobs";
import { IGetJobResult, IGetJobTypeResult, ISearchTypeResult, IShowResultJobTypes } from "../types/types";

export async function getJobTypes(db: PrismaClient): Promise<IShowResultJobTypes> {
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

export async function getJobType({ db, type }: IGetJobTypeResult): Promise<Job[]> {
  try {
    const jobType = await db.job.findMany({
      where: {
        job_type: type
      }
    })
    return jobType;

  } catch (error) {
    throw new Error("Error while running query " + error)
  }
}

export async function getJob({ db, id }: IGetJobResult): Promise<Job> {
  try {
    const job = await db.job.findUnique({
      where: {
        id: Number(id)
      }
    })

    return job;
  } catch (error) {
    throw new Error("Error while running query " + error)
  }
}

export async function search({ db, keywordType, keyword, byResult, take }: ISearchTypeResult): Promise<Job[] | Array<{ title: string }>> {
  try {
    const result = await db.job.findMany({
      ...isByResult({ byResult }),
      where: {
        ...isByKeywords(keywordType, keyword),
      },
      take: 20 + take,
    });
    queryMinMax((result as Job[]));

    return result
  } catch (error) {
    throw new Error("Error when running query" + error);
  }
}


type NewValues = {
  min: number | undefined;
  max: number | undefined;
}

type IJobs = Job & NewValues

export function queryMinMax(jobs: Job[]) {
  let newSalary: string = "";
  let min = [];
  let max = [];
  const filteredJobs: IJobs[] = new Array(jobs.length);

  for (let j = 0; j < jobs.length; j++) {
    // clean up our salaries
    newSalary = cleanupSalaries(jobs[j].salary)

    if (newSalary.match('-')) {
      let sal = newSalary.replace('-', ' -');
      const splitSal = sal.split(' ');

      for (let i = 0; i < splitSal.length; i++) {
        // remove empty string
        if (splitSal[i] == '') {
          splitSal.splice(i, 1)
        }

        if (splitSal[i] == '-') {
          min.push(toNumber(splitSal[i - 1].replace('K', ',000').replace('k', ',000')))
          max.push(toNumber(splitSal[i + 1].replace('K', ',000').replace('k', ',000')))
        }
      }
    } else {
      min.push(0)
      max.push(toNumber(newSalary))
    }
  }
  for (let i = 0; i < min.length; i++) {
    // console.log({ i, min: min[i], max: max[i] })
  }
}

function toNumber(max: string) {
  return Number(max.replace('$', '').replace(',', '').replace(' ', ''));
}
