import type { Job, PrismaClient } from "@prisma/client";
import { extractDuplicate, isByKeywords, isByResult } from "../helpers/jobs";
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

export async function search({ db, keywordType, keyword, byResult }: ISearchType): Promise<Job[] | Array<{ title: string }>> {
  try {
    const result = await db.job.findMany({
      ...isByResult({ byResult }),
      where: {
        ...isByKeywords(keywordType, keyword),
      }
    });

    return result
  } catch (error) {
    throw new Error("Error when running query" + error);
  }
}