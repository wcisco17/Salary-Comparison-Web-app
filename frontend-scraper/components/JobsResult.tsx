import { Box, Text } from "@chakra-ui/react";
import { SalaryValue } from "components/SalaryValue";
import { TableContent } from "components/TableContent";
import React from "react";
import { IJobs } from "types/api";
import { ICompaniesResult } from "../api";

type IJobResult = {
  jobs: { data: IJobs[] | undefined; };
  companies: { data: ICompaniesResult[] | null; };
  search: string | undefined;
  minValue: number;
  min: number[] | null;
  max: number[] | null;
  maxValue: number;
  handleChangeMax: (event: any) => void
  handleChangeMin: (event: any) => void
}

export function JobsResult({
  jobs,
  companies,
  search,
  min,
  minValue,
  handleChangeMax,
  handleChangeMin,
  max,
  maxValue
}: IJobResult) {
  if (!search) return <Text>Type up your search</Text>
  if (!jobs.data || !companies.data) return <Text>Search value not found: {search}...</Text>
  if (jobs.data.length <= 0 || companies.data.length <= 0) return <Text>No data...</Text>
  if (search.length <= 0) return <Text>nothing...</Text>

  return (
    <Box mr="5">
      <SalaryValue
        minValue={minValue}
        min={min}
        max={max}
        maxValue={maxValue}
        handleChangeMax={handleChangeMax}
        handleChangeMin={handleChangeMin} />
      <TableContent companies={(companies.data as ICompaniesResult[])} data={(jobs.data)} />
    </Box>
  )
}

