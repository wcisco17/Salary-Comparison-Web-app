import { Job, PrismaClient, Website } from '@prisma/client';
import express from 'express';
import { getAllJobs, getJob, getJobType, getJobTypes, search } from "./db/jobs";
import { IJobs, ISearchTypeResult } from "./types/types";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();
app.use(cors())
app.use(express.json());
const PORT = 8080;

const api = async () => {
  app.get("/jobs", async (_, res) => {
    const jobs = await getAllJobs({ db: prisma });
    res.json(jobs);
  })

  app.get("/job_types", async (_, res) => {
    const jobTypes = await getJobTypes(prisma);
    res.json(jobTypes);
  })

  app.get("/search/:keyword/:keywordType/:byResult/:take", async (req, res) => {
    const take: number = 0;
    const byResult: Pick<ISearchTypeResult, 'byResult'> = (req.params.byResult as unknown as Pick<ISearchTypeResult, 'byResult'>)
    const keywordType: Pick<ISearchTypeResult, 'keywordType'> = (req.params.keywordType as unknown as Pick<ISearchTypeResult, 'keywordType'>)
    const keyword: string = req.params.keyword

    let min: unknown = Number(req.query.min);
    let max: unknown = Number(req.query.max);

    if (!min)
      min = null
    if (!max)
      max = null

    // THE SEARCH RESULT ON THE FRONTEND WOULD SHOW: found 120 jobs for keys: (Senior)
    const items = await search({ db: prisma, keywordType, keyword, byResult, take, min, max });

    if (items.length <= 0)
      res.json({ error: `No results for keyword: ${keyword}` })

    res.json(items);
  })

  app.get("/job_type/:type", async (req, res, next) => {
    const type = req.params.type;

    let min = Number(req.query.min);
    let max = Number(req.query.max);

    if (!min)
      min = null
    if (!max)
      max = null

    const items: IJobs[] = await getJobType({ db: prisma, type, min, max });

    if (items.length <= 0)
      res.json([])

    res.json(items);
  })

  app.get("/job/:id", async (req, res) => {
    const id = Number(req.params.id);
    const item: Job = await getJob({ db: prisma, id });

    if (!item)
      res.json({ error: `No Job found with id: ${id}` })
    res.json(item)
  })

  app.get("/companies", async (_, res) => {
    const companies: Pick<Website, 'id' | 'title'>[] = await prisma.website.findMany({
      select: {
        id: true,
        title: true,
      },
      orderBy: {
        id: 'asc'
      }
    });
    res.json(companies)
  })

  app.get("/", async (_, res) => {
    res.json({ hello: "mode!" });
  })

  let hostname = "0.0.0.0";
  app.listen(PORT, hostname, () => {
    console.log(`Listening on port: ${PORT}`);
  });
}

api()