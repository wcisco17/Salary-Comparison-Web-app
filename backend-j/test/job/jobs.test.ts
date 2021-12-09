import { Job } from '@prisma/client';
import { Context } from '../context';

export async function createJob(job: Job, ctx: Context) {
  return await ctx.prisma.job.create({
    data: job,
  })
}
