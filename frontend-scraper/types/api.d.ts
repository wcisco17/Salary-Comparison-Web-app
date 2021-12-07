import type { Job, PrismaClient } from "@prisma/client";

export type IShowResultJobTypes = Pick<Job, 'job_type'>[];

export type ISearchTypeResult = {
  db: PrismaClient;
  keywordType: "title" | "company_name" | unknown;
  byResult: "title" | "company_name" | 'all' | unknown;
  keyword: string;
  take?: number;
  min?: Pick<IQueryMinMax, 'min'>;
  max?: Pick<IQueryMinMax, 'max'>;
};

export type IGetJobTypeResult = {
  db: PrismaClient;
  type: string;
} & Pick<IJobs, 'min'> & Pick<IJobs, 'max'>

export type IGetJobResult = {
  db: PrismaClient;
  id: number;
}

export type IJobs = {
  min: number | undefined;
  max: number | undefined;
  job: Job
}

export type ISearchResult = IJobs[] | Job[] | Array<{
  title: string;
}>;

export type IQueryMinMax = {
  filteredJobs: IJobs[]
  min?: number | null
  max?: number | null
}