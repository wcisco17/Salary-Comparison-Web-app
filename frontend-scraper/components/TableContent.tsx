import {
  Button,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue as mode
} from '@chakra-ui/react'
import { ICompaniesResult } from "api"
import * as React from 'react'
import { IJobs } from "types/api"
import { columns } from './data'

type Props = {
  data: IJobs[]
  companies: ICompaniesResult[]
}

export const TableContent: React.FC<Props> = ({ data, companies }) => {
  return (
    <Table my="8" borderWidth="1px" fontSize="sm">
      <Thead bg={mode('gray.50', 'gray.800')}>
        <Tr>
          {columns.map((column, index) => (
            <Th whiteSpace="nowrap" scope="col" key={index}>
              {column.Header}
            </Th>
          ))}
          <Th />
        </Tr>
      </Thead>
      <Tbody>
        {data!.map((row) => {
          return (
            <Tr key={row.job.id}>
              {columns.map((column, index) => {
                const cell = row.job[column.accessor as keyof typeof row.job]
                const element = column.Cell?.(cell) ?? cell
                const company = companies[row.job.websiteId - 1]

                if (column.accessor == 'all')
                  return <Td key={index} >{column.Cell?.(row.job)}</Td>

                if (column.accessor == 'websiteId')
                  return <Td key={index}> {column.CellSource?.([company])}</Td>

                return (
                  <Td whiteSpace="nowrap" key={index}>
                    {element}
                  </Td>
                )
              })}
              <Td textAlign="right">
                <Button onClick={() => window.open(row.job.url)} variant="link" colorScheme="blue">
                  View more
                </Button>
              </Td>
            </Tr>
          )
        }
        )}
      </Tbody>
    </Table>
  )
}