import { Badge } from "@chakra-ui/react";
import * as React from 'react';
import { Job } from "types";
import { Logo } from "./Logo";

export const columns = [
  {
    Header: 'Job',
    accessor: 'all',
    Cell: function MemberCell(data: Job) {
      return <Logo data={data} />
    },
  },

  {
    Header: 'Salary',
    accessor: 'salary',
    Cell: function MemberCell(data: any) {
      return <div>{data}</div>
    },
  },

  {
    Header: 'Industry',
    accessor: 'job_type',
    Cell: function StatusCell(data: any) {
      return (
        <Badge fontSize="xs" bg="brand.main" color="white" >
          {data}
        </Badge>
      )
    },
  },
  {
    Header: 'Source',
    accessor: 'websiteId',
    CellSource: function MemberCell(data: any) {
      return (
        <Badge fontSize="xs" bg="#805AD5" color="white" >
          {data[0].title}
        </Badge>
      )
    },
  },
]