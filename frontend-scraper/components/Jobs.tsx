import { Text } from "@chakra-ui/react";
import { ICompaniesResult } from "api";
import { TableContent } from "components/TableContent";
import { IAPIState } from "pages/type/[type]";
import React from "react";

type IJob = {
  api: IAPIState;
  companies: ICompaniesResult[]
}

export function Jobs({
  api,
  companies,
}: IJob) {
  if (!api!.data || api.error != null) return <Text my="5" >No data yet... or change min and max values</Text>
  if (api.loading) return <Text>Loading.. data</Text>

  return (
    <>
      <TableContent companies={companies} data={api.data} />
    </>
  )
}