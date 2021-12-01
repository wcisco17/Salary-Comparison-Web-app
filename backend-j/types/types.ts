import type { Job, PrismaClient } from "@prisma/client";

export type IShowResultJobTypes = Pick<Job, 'job_type'>[];

export type ISearchType = {
  db: PrismaClient;
  keywordType: "title" | "company_name" | unknown;
  byResult: "title" | "company_name" | 'all' | unknown;
  keyword: string;
  take?: number;
};
