import { PrismaClient } from '@prisma/client';
import express from 'express';
import { dbShowJobTypes, search } from "./db/jobs";
import { ISearchType } from "./types/types";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

(() => {
  app.get("/job_types", async (req, res) => {
    const jobTypes = await dbShowJobTypes(prisma);
    res.json(jobTypes);
  })

  app.get("/search/:keyword/:keywordType/:byResult/:take", async (req, res) => {
    const take: number = 0;
    const byResult: Pick<ISearchType, 'byResult'> = (req.params.byResult as unknown as Pick<ISearchType, 'byResult'>)
    const keywordType: Pick<ISearchType, 'keywordType'> = (req.params.keywordType as unknown as Pick<ISearchType, 'keywordType'>)
    const keyword: string = req.params.keyword

    const items = await search({ db: prisma, keywordType, keyword, byResult, take });
    res.json(items);
  })

  app.get("/", async (_, res) => {
    res.json({ hello: "mode!" });
  })

  app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
  })

  // 4. List min max of jobs - needs to compile all the min and max values to compare. - Needs to work with function above.

  // 5. detail of one job (What can be considered later on is how to fetch more information from the Job details)
})()