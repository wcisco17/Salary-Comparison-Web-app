import { Box, Img, Stack } from '@chakra-ui/react'
import * as React from 'react'
import { Job } from "types"

interface LogoProps {
  data: Job
}

export const Logo = (props: LogoProps) => {
  return (
    <Stack direction="row" spacing="4" align="center">
      <Box flexShrink={0} h="10" w="10">
        <Img
          objectFit="cover"
          htmlWidth="100px"
          htmlHeight="160px"
          w="10"
          h="10"
          rounded="full"
          src={(props.data?.logo as string).indexOf('https') != -1 ? (props.data?.logo as string) : 'https://c.neevacdn.net/image/fetch/s--8fqBC7Da--/https%3A//spa-company.com/wp-content/uploads/2020/03/dummy-logo-08.png?savepath=dummy-logo-08.png'}
          alt="L"
        />
      </Box>

      <Box>
        <Box fontSize="sm" fontWeight="medium">
          {props.data?.title}
        </Box>
        <Box fontSize="sm" color="gray.500">
          {props.data?.company_name}
        </Box>
        <Box fontSize="sm" color="gray.700">
          {props.data?.location}
        </Box>
      </Box>
    </Stack>
  )
}