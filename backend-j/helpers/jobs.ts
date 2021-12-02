import { ISearchTypeResult, IShowResultJobTypes } from "../types/types";

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
  return sal.replace('*', '').replace('💰', '').replace('k', '').replace('(Glassdoor est.)', '').replace('a year', '').replace('(Employer est.)', '').replace('Per', '').replace('Hour', '').replace(' ', '')
}

// const getJobTypes = async () => {
//   const items = await search({ db: prisma, keywordType: 'title', keyword: "Sof", byResult: 'all', take: 0 });
//   // list out the values

//   // seperate function here that returns the min and max of the search values
//   queryMinMax((items as Job[]));
// }

// getJobTypes();