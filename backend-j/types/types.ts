import type { Job, PrismaClient } from "@prisma/client";

export type IShowResultJobTypes = Pick<Job, 'job_type'>[];

export type ISearchTypeResult = {
  db: PrismaClient;
  keywordType: "title" | "company_name" | unknown;
  byResult: "title" | "company_name" | 'all' | unknown;
  keyword: string;
  take?: number;
};

export type IGetJobTypeResult = {
  db: PrismaClient;
  type: string;
}

export type IGetJobResult = {
  db: PrismaClient;
  id: number;
}