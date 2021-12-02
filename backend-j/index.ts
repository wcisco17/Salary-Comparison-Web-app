import { Job, PrismaClient } from '@prisma/client';
import express from 'express';
import { getJob, getJobType, getJobTypes, queryMinMax, search } from "./db/jobs";
import { ISearchTypeResult } from "./types/types";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());
const PORT = process.env.PORT || 3000;

(() => {
  app.get("/job_types", async (req, res) => {
    const jobTypes = await getJobTypes(prisma);
    res.json(jobTypes);
  })

  app.get("/search/:keyword/:keywordType/:byResult/:take", async (req, res) => {
    const take: number = 0;
    const byResult: Pick<ISearchTypeResult, 'byResult'> = (req.params.byResult as unknown as Pick<ISearchTypeResult, 'byResult'>)
    const keywordType: Pick<ISearchTypeResult, 'keywordType'> = (req.params.keywordType as unknown as Pick<ISearchTypeResult, 'keywordType'>)
    const keyword: string = req.params.keyword

    // THE SEARCH RESULT ON THE FRONTEND WOULD SHOW: found 120 jobs for keys: (Senior)
    const items = await search({ db: prisma, keywordType, keyword, byResult, take });

    if (items.length <= 0)
      return res.json({ error: `No results for keyword: ${keyword}` })

    res.json(items);
  })

  app.get("/job_type/:type", async (req, res) => {
    const type = req.params.type;
    const items: Job[] = await getJobType({ db: prisma, type, });

    if (items.length <= 0)
      res.json({ error: "No Job type found" })
    res.json(items);
  })

  app.get("/job/:id", async (req, res) => {
    const id = Number(req.params.id);
    const item: Job = await getJob({ db: prisma, id });

    if (!item)
      res.json({ error: `No Job found with id: ${id}` })
    return res.json(item)
  })

  app.get("/", async (_, res) => {
    res.json({ hello: "mode!" });
  })

  app.listen(PORT, () => {
    console.log(`listening at http://localhost:${PORT}`);
  })

  // 4. List min max of jobs - needs to compile all the min and max values to compare. - Needs to work with function above.

})()