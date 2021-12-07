import { Box, Flex, Heading, Select, Text } from "@chakra-ui/react";
import { getCompanies, getJobType, getJobTypes, ICompaniesResult } from "api";
import { Jobs } from "components/Jobs";
import { removeDuplicatNums, sortValues } from "helpers";
import { GetStaticPropsContext, GetStaticPropsResult, InferGetStaticPropsType } from "next";
import React, { useEffect, useState } from "react";
import { IJobs, IShowResultJobTypes } from "types/api";

type IJobTypeResult = {
  job_type: string | undefined
  companies: ICompaniesResult[]
};

export async function getStaticPaths() {
  const data: IShowResultJobTypes = await getJobType();

  return {
    paths: data.map((type) => {
      return {
        params: {
          type: type.job_type
        }
      }
    }) || [{ params: { type: [] } }],
    fallback: false,
  }
}

export async function getStaticProps({
  params
}: GetStaticPropsContext<{ type: string }, any>): Promise<GetStaticPropsResult<IJobTypeResult>> {
  const job_type = (params?.type);
  const companies: ICompaniesResult[] = await getCompanies();

  return {
    props: {
      job_type,
      companies,
    }
  }
}

export type IAPIState = {
  data: IJobs[] | undefined;
  loading: boolean;
  error: string | null;
};

function JobType({ companies, job_type }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [maxValue, setMaxValue] = React.useState(0)
  const [minValue, setMinValue] = React.useState(0)
  const [n, setN] = React.useState<any>()
  const [api, setApi] = useState<IAPIState>({
    data: undefined,
    loading: false,
    error: null
  });

  const fetchJobsData = async () => {
    setApi({ data: undefined, loading: true, error: null })
    try {
      const jobs = await getJobTypes({ job_type: job_type ?? '', max: maxValue, min: minValue });
      if (jobs!.length > 0) {
        setApi({
          loading: false,
          data: jobs,
          error: null
        })
      }
    } catch (error) {
      setApi({
        data: undefined,
        loading: false,
        error: JSON.stringify(error),
      })
    }
  }

  useEffect(() => {
    fetchJobsData()
  }, [maxValue, minValue])

  const nums = async () => {
    try {
      const jobs = await getJobTypes({ job_type: job_type ?? '', max: undefined, min: undefined });
      if (jobs!.length > 0) {
        setN(jobs)
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    nums()
  }, [])

  const min = sortValues(removeDuplicatNums(n, "min"))
  const max = sortValues(removeDuplicatNums(n, "max"))

  const handleChangeMin = (event: any) => {
    setMinValue(Number(event.target.value))
  }

  const handleChangeMax = (event: any) => {
    setMaxValue(Number(event.target.value))
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
            Compare Job prices
          </Box>
          <Flex>
            <Select value={Number(minValue)} onChange={(handleChangeMin)} placeholder='Min Salary'>
              {
                min?.map(value => value !== null && <option key={value} value={value}>${value}</option>)
              }
            </Select>

            <div style={{ paddingRight: '20px' }} />

            <Select value={Number(maxValue)} onChange={(handleChangeMax)} placeholder='Max Salary'>
              {
                max?.map(value => value !== null && <option key={value} value={value}>${value}</option>)
              }
            </Select>
          </Flex>
          <Jobs
            api={api}
            companies={companies}
          />
        </Box>

      </Box>
    </Box>
  )
}

export default JobType