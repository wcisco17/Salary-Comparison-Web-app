import { ISearchType, IShowResultJobTypes } from "../types/types";

/**
 * 
 * @notes Need to improve space and time complexity 
 */
// Time Complexity: O(n + 1) n = length of the array, 1 = look up the keys
// Space complexity: O(n + 1) = n length of the input array, 1 = hash table.
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

export const isByKeywords = (by: 'title' | 'company_name', keyword: string): object => {
  if (by === "title") {
    return {
      title: { startsWith: keyword }
    }
  } else if (by === "company_name") {
    return {
      company_name: { startsWith: keyword }
    }
  }
}

export const isByResult = (result: Pick<ISearchType, 'byResult'>): {} => {
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