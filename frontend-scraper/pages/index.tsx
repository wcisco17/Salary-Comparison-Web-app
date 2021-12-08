/* eslint-disable react-hooks/exhaustive-deps */
import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { JobsResult } from "components/JobsResult";
import { removeDuplicatNums, sortValues } from "helpers";
import { GetServerSidePropsContext, GetStaticPropsResult, InferGetServerSidePropsType } from 'next';
import { useRouter } from "next/dist/client/router";
import Image from 'next/image';
import React, { useEffect } from "react";
import { IJobs, IShowResultJobTypes } from "types/api";
import { getCompanies, getJobType, getSearch, ICompaniesResult } from "../api";
import logo from "../public/ldark.png";

export const getServerSideProps = async (_: GetServerSidePropsContext): Promise<GetStaticPropsResult<{
  data: IShowResultJobTypes
}>> => {
  const data: IShowResultJobTypes = await getJobType();

  // return an empty array if there is no data
  if (!data) {
    return {
      props: { data: [] }
    }
  }

  return {
    props: { data }
  }
}

export default function Index({ data }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const router = useRouter();
  const [maxValue, setMaxValue] = React.useState(0)
  const [minValue, setMinValue] = React.useState(0)
  const [search, setSearch] = React.useState<string | undefined>();

  const [n, setN] = React.useState<any>()
  const [jobs, setApiIJobs] = React.useState<{
    data: IJobs[] | undefined
  }>({
    data: undefined
  })
  const [companies, setApiICompanies] = React.useState<{
    data: ICompaniesResult[] | null
  }>({
    data: null
  })

  const fetchCompanies = async () => {
    setApiICompanies({ data: null })
    try {
      const comp = await getCompanies();
      if (comp && comp.length > 0) {
        setApiICompanies({ data: comp })
      }
    } catch (error) {
      setApiICompanies({ data: null })
    }
  }

  const fetchLengthValue = async () => {
    setApiIJobs({ data: undefined })
    try {
      const jobsLength = await getSearch({ value: search, max: maxValue, min: minValue });
      if (jobsLength && jobsLength.length > 0) {
        setApiIJobs({ data: jobsLength })
      }

    } catch (error) { setApiIJobs({ data: undefined }) }
  }

  React.useEffect(() => {
    fetchCompanies()
  }, [search])

  React.useEffect(() => {
    fetchLengthValue()
  }, [search, maxValue, minValue])

  const onChange = (e: any) => {
    setSearch(e.target.value)
  }

  const nums = async () => {
    try {
      const jobs = await getSearch({ value: search, max: maxValue, min: minValue });
      if (jobs!.length > 0) {
        setN(jobs)
      }
    } catch (error) {
    }
  }

  useEffect(() => {
    nums()
  }, [search])

  const min = sortValues(removeDuplicatNums(n, "min"))
  const max = sortValues(removeDuplicatNums(n, "max"))

  const handleChangeMin = (event: any) => {
    setMinValue(Number(event.target.value))
  }

  const handleChangeMax = (event: any) => {
    setMaxValue(Number(event.target.value))
  }

  return (
    <Flex display="flex" flexDirection="column" alignItems="center" mx="5" borderRadius="10" justifyContent="center" backgroundColor='white'>

      <Flex height="100%" width="100%" my="18" display="flex" flexDirection="column" mt="50">
        <Text mb="3" color="black" textAlign="center" fontSize='4xl'>Search Jobs by Topics</Text>
        <Box display="flex" alignItems="center" justifyContent="center" mb="7" >
          {
            data.length >= 0 && data?.map((jobTypes, key) => {
              const trJobTypes = jobTypes.job_type
              return (
                <Button
                  onClick={() => router.push(
                    `/type/[type]`,
                    `/type/${trJobTypes}`
                  )}
                  key={key}
                  mb='3'
                  mr="4" bg="brand.main" rounded="100" color="white" rightIcon={<ArrowRightIcon />} >
                  {jobTypes?.job_type}
                </Button>
              )
            })
          }
        </Box>
      </Flex>

      <Box alignItems="center" display="flex" justifyContent="center" >
        <Image className='container-logo--img' src={logo} layout="fixed" alt="..." />
      </Box>

      <Input mt="4" value={search} onChange={onChange} placeholder='Search for Job Title' />

      <div style={{ marginTop: 12, marginBottom: 12 }} />

      <JobsResult
        jobs={jobs}
        companies={companies}
        search={search}
        minValue={minValue}
        min={min}
        max={max}
        maxValue={maxValue}
        handleChangeMax={handleChangeMax}
        handleChangeMin={handleChangeMin}
      />
    </Flex>
  )
}

