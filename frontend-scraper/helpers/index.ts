import { IJobs } from "types/api";

export function removeDuplicatNums(data: IJobs[] | undefined, convert: "min" | "max") {
  let hashTable = new Map<number, number>()
  let convertArr = []
  if (!data) return null
  else
    for (let i = 0; i < data!.length; i++) {
      const min = (data![i].min as number);
      const max = (data![i].max as number);

      if (!(min in hashTable)) {
        if (convert == "min")
          hashTable.set(min, i);
        if (convert == "max")
          hashTable.set(max, i);
      }
    }

  for (let [key, _] of hashTable)
    convertArr.push(key)

  return convertArr;
}

export const sortValues = (data: number[] | undefined | null) => {
  if (!data) return null
  else
    return data.sort((a, b) => {
      if (a < b) return -1;
      if (b > a) return -1;
      return 0
    })
}