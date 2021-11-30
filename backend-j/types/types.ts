import type { Job, PrismaClient } from "@prisma/client";

export type IShowResultJobTypes = Pick<Job, 'job_type'>[];

export type ISearchType = {
  db: PrismaClient;
  keywordType: "title" | "company_name";
  byResult: "title" | "company_name" | 'all';
  keyword: string;
};
