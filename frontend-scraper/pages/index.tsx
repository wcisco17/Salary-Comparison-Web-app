import { ArrowRightIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Input, Text } from "@chakra-ui/react";
import { GetServerSidePropsContext, GetStaticPropsResult, InferGetServerSidePropsType } from 'next';
import { useRouter } from "next/dist/client/router";
import Image from 'next/image';
import React from "react";
import { IShowResultJobTypes } from "types/api";
import { getJobType, getSearchLength } from "../api";
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
  const [search, setSearch] = React.useState<string | undefined>();
  const [api, setApi] = React.useState<{
    dataLength: number | null;
  }>({
    dataLength: null,
  })

  const fetchLengthValue = async () => {
    setApi({ dataLength: null })
    try {
      const jobsLength = await getSearchLength({ value: search });
      if (jobsLength > 0) setApi({ dataLength: jobsLength, })
    } catch (error) { setApi({ dataLength: null }) }
  }

  React.useEffect(() => {
    fetchLengthValue()
  }, [search])

  const onChange = (e: any) => {
    setSearch(e.target.value)
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

      <Flex justifyContent="center" alignItems="center" mt="10">
        <Box mr="5" >
          <Input value={search} onChange={onChange} placeholder='Search for Job Title' size='lg' />

          {
            search && search.length > 0 && (
              <li id="search-item-0" className="css-s3502a">

                <div className="css-1rr4qq7"><span className="css-oufhr">
                  {
                    !(api.dataLength) ? <span>No jobs found...</span> : <span>Found {api.dataLength} jobs with the keywords: {search}</span>
                  }
                </span>
                </div>
              </li>
            )
          }

        </Box>
      </Flex>
    </Flex>
  )
}
