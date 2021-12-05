import { Box, Flex, Heading, Select, Text } from "@chakra-ui/react";
import { getAllJobs, getCompanies, getJobType, ICompaniesResult } from "api";
import { TableContent } from "components/TableContent";
import { removeDuplicatNums, sortValues } from "helpers";
import { GetStaticPropsContext, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import { useRouter } from "next/dist/client/router";
import React from "react";
import { IJobs } from "types/api";

type IJobTypeResult = {
  data: IJobs[];
  job_type: string | undefined
  companies: ICompaniesResult[]
  min: number;
  max: number;
};

export async function getStaticPaths() {
  const data: IJobs[] = await getAllJobs();

  return {
    paths: data.map((type) => {
      const min = String(type?.min);
      const max = String(type?.max);

      return {
        params: {
          type: [type.job.job_type, '0', '80000']
        }
      }
    }) || [{ params: { type: [] } }],
    fallback: false,
  }
}

export async function getStaticProps({
  params
}: GetStaticPropsContext<{ type: Array<string> }, any>): Promise<GetStaticPropsResult<IJobTypeResult>> {
  const job_type = (params?.type[0] as string);
  const min = Number(params?.type[1]);
  const max = Number(params?.type[2]);

  const jobs: IJobs[] = await getJobType({ job_type, min, max });
  const companies: ICompaniesResult[] = await getCompanies();

  if (!jobs)
    return {
      props: {
        companies: [] as ICompaniesResult[],
        job_type: undefined,
        data: [],
        max: 0,
        min: 0,
      }
    }

  return {
    props: {
      job_type,
      data: jobs,
      companies,
      min,
      max,
    }
  }
}

function JobType(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data, job_type, companies, min: queryMin, max: queryMax } = props;
  const router = useRouter()

  const min = sortValues(removeDuplicatNums(data, "min"))
  const max = sortValues(removeDuplicatNums(data, "max"))

  const [minValue, setMinValue] = React.useState(0)
  const handleChangeMin = (event: any) => {
    setMinValue(Number(event.target.value))
    router.push(`${job_type}/${event.target.value}`)
  }

  const [maxValue, setMaxValue] = React.useState(0)
  const handleChangeMax = (event: any) => {
    setMaxValue(Number(event.target.value))
    router.push(`${job_type}/${minValue}/${event.target.value}`)
  }

  return (
    <Box as="section" py="12">
      <Text></Text>
      <Box maxW={{ base: 'xl', md: '7xl' }} mx="auto" px={{ base: '6', md: '8' }}>
        <Box overflowX="auto">
          <Heading size="lg" mb="6">
            {job_type}
          </Heading>
          <Box fontSize="md" mb="3" color="gray.500" >
            Filter by
          </Box>
          <Flex>
            <Select value={Number(minValue)} onChange={(handleChangeMin)} placeholder='Min Salary'>
              {
                min.map(value => value !== null && <option key={value} value={value}>{value}</option>)
              }
            </Select>

            <div style={{ paddingRight: '20px' }} />

            <Select value={Number(maxValue)} onChange={(handleChangeMax)} placeholder='Max Salary'>
              {
                max.map(value => value !== null && <option key={value} value={value}>{value}</option>)
              }
            </Select>
          </Flex>
          {data.length <= 0 ? <Text my="5" >No data yet...</Text> : <TableContent companies={companies} data={data} />}
        </Box>
      </Box>
    </Box>
  )
}

export default JobType