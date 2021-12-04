import { Job } from "@prisma/client";
import { IJobs, ISearchTypeResult, IShowResultJobTypes } from "../types/types";

/**
 * 
 * @notes Need to improve space complexity 
 */
// Time Complexity: O(n) n = length of the array, 1 = look up the keys
// Space complexity: O(n) = n length of the input array, 1 = hash table.
export function extractDuplicate(jobTypes: IShowResultJobTypes): IShowResultJobTypes {
  const newHash = new Map<string, number>();

  let currentJobType: string | null = "";
  let result: IShowResultJobTypes = [];

  for (let i = 0; i < jobTypes.length; i++) {
    (currentJobType as string | null) = jobTypes[i].job_type;

    // set dup values in hash table.
    if (!(currentJobType in newHash)) newHash.set(currentJobType, i);
  }

  for (let [key, _] of newHash)
    result.push({ job_type: key });

  return result;
}

export const isByKeywords = (by: 'title' | 'company_name' | unknown, keyword: string): object => {
  if (by === "title") {
    return {
      title: { contains: keyword, mode: 'insensitive' }
    }
  } else if (by === "company_name") {
    return {
      company_name: { contains: keyword, mode: 'insensitive' }
    }
  }
}

export const isByResult = (result: Pick<ISearchTypeResult, 'byResult'>): {} => {
  const { byResult } = result;

  switch (byResult) {
    case 'title':
      return {
        select: {
          title: true,
        }
      }
    case 'company_name':
      return {
        select: {
          company_name: true,
        }
      }

    case 'all':
      return {}

    default:
      return {}
  }
}

export function cleanupSalaries(salary: string) {
  const sal = salary ? salary : ''
  return sal.replace('*', '').replace('💰', '').replace('(Glassdoor est.)', '').replace('a year', '').replace('(Employer est.)', '').replace('Per', '').replace('Hour', '').replace(' ', '')
}

export function convertMinMax(jobs: Job[]): IJobs[] {
  let newSalary: string = "";
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
          filteredJobs[j] = {
            min: toNumber(turnK(splitSal[i - 1])),
            max: toNumber(turnK(splitSal[i + 1])),
            job: jobs[j]
          }
        }
      }
    } else {
      filteredJobs[j] = {
        min: 0,
        max: toNumber(turnK(newSalary)),
        job: jobs[j]
      }
    }
  }
  return filteredJobs;
}

function toNumber(max: string) {
  return Number(max.replace('$', '').replace(',', '').replace(' ', '').replace('(Employer est.)', ''));
}

function turnK(num: string) {
  num = num.replace('K', ',000').replace('k', ',000')
  return num
}