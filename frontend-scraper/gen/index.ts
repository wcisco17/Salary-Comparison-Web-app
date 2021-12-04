import fs from 'fs';
import path from "path";

const PATH_PRISMA_CLIENT: string = "../../../coursework1/salary-comp/backend-j/node_modules/.prisma/client/index.d.ts"
const PATH_API: string = "../../../coursework1/salary-comp/backend-j/types/types.ts"

export const writeTypes = async () => {
  try {
    // update the general api types
    let generalTypes = fs.readFileSync(path.resolve(PATH_PRISMA_CLIENT as string)).toString()
    await fs.writeFileSync('types/index.d.ts', generalTypes);

    // update the custom api types
    let apiTypes = fs.readFileSync(path.resolve(PATH_API)).toString()
    await fs.writeFileSync('types/api.d.ts', apiTypes);

  } catch (err) {
    throw new Error(`Error reading file: ${err}`)
  }
}

writeTypes()
