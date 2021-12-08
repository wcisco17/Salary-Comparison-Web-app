import { Flex, Select } from "@chakra-ui/react";
import { default as React } from "react";

type ISalaryValue = {
  minValue: number;
  handleChangeMin: (event: any) => void;
  min: number[] | null;
  maxValue: number;
  handleChangeMax: (event: any) => void;
  max: number[] | null;
};

export function SalaryValue({ minValue, handleChangeMin, min, maxValue, handleChangeMax, max }: ISalaryValue) {
  return (
    <Flex>
      <Select value={Number(minValue)} onChange={(handleChangeMin)} placeholder='Min Salary'>
        {min?.map(value => value !== null && <option key={value} value={value}>${value}</option>)}
      </Select>

      <div style={{ paddingRight: '20px' }} />

      <Select value={Number(maxValue)} onChange={(handleChangeMax)} placeholder='Max Salary'>
        {max?.map(value => value !== null && <option key={value} value={value}>${value}</option>)}
      </Select>
    </Flex>
  );
}
