import { PrismaClient } from '@prisma/client';
import express from 'express';
import { search } from "./db/jobs";

const prisma = new PrismaClient();
const app = express();

app.use(express.json());

const getJobTypes = async () => {
  const items = await search({ db: prisma, keywordType: 'title', keyword: "Senior", byResult: 'company_name' });
  console.log(items);
}

getJobTypes();

(() => {

  /**
   * @methods Queries
   */

  // 4. List min max of jobs - needs to compile all the min and max values to compare. - Needs to work with function above.

  // 5. detail of one job (What can be considered later on is how to fetch more information from the Job details)
})()