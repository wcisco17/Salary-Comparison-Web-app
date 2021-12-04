import { Box, Flex, Heading, Select } from "@chakra-ui/react";
import { getCompanies, getJobType, getJobTypes, ICompaniesResult } from "api";
import { TableContent } from "components/TableContent";
import { GetStaticPathsResult, GetStaticPropsContext, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { IJobs, IShowResultJobTypes } from "types/api";

export async function getStaticPaths(): Promise<GetStaticPathsResult> {
  const data: IShowResultJobTypes = await getJobTypes();

  return {
    paths: data.map((type) => ({
      params: {
        type: (type.job_type as string)
      }
    })) || [{ params: {} }],
    fallback: false,
  }
}

type IJobTypeResult = {
  data: IJobs[];
  job_type: string | undefined
  companies: ICompaniesResult[]
}

export async function getStaticProps({ params }: GetStaticPropsContext<{ type: string }, any>): Promise<GetStaticPropsResult<IJobTypeResult>> {
  const type = params?.type;
  const jobs: IJobs[] = await getJobType({ job_type: (type as string), min: undefined, max: undefined });
  const companies: ICompaniesResult[] = await getCompanies();

  if (jobs.length <= 0)
    return {
      props: {
        companies: [] as ICompaniesResult[],
        job_type: undefined,
        data: [] as IJobs[]
      }
    }

  return {
    props: {
      job_type: type,
      data: jobs,
      companies
    }
  }
}

function JobType({ data, job_type, companies }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <Box as="section" py="12">
      <Box maxW={{ base: 'xl', md: '7xl' }} mx="auto" px={{ base: '6', md: '8' }}>
        <Box overflowX="auto">
          <Heading size="lg" mb="6">
            {job_type}
          </Heading>
          <Box fontSize="md" mb="3" color="gray.500" >
            Filter by
          </Box>
          <Flex>
            <Select placeholder='Min Salary'>
              <option value='option1'>Option 1</option>
              <option value='option2'>Option 2</option>
              <option value='option3'>Option 3</option>
            </Select>
            <div style={{ paddingRight: '20px' }} />
            <Select placeholder='Max Salary'>
              <option value='option1'>Option 1</option>
              <option value='option2'>Option 2</option>
              <option value='option3'>Option 3</option>
            </Select>
          </Flex>

          <TableContent companies={companies} data={data} />
        </Box>
      </Box>
    </Box>
  )
}

export default JobType