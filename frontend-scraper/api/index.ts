import { Website } from "types";
import { IJobs, IShowResultJobTypes } from "types/api";

const BACKEND_API = `http://localhost:8080`;

export const getJobTypes = async (): Promise<IShowResultJobTypes> => {
  const api = await fetch(`${BACKEND_API}/job_types`, {
    method: "GET",
  });

  const data: IShowResultJobTypes = await api.json();
  return data;
}

type IGetJobParams = {
  job_type: string
} & Pick<IJobs, 'min'> & Pick<IJobs, 'max'>

export const getJobType = async ({ job_type, max, min }: IGetJobParams): Promise<IJobs[]> => {
  const api = await fetch(`${BACKEND_API}/job_type/${job_type}?min=${min}&max=${max}`, {
    method: "GET"
  });

  const data: IJobs[] = await api.json();
  return data;
}

export type ICompaniesResult = Pick<Website, 'id' | 'title'>;

export const getCompanies = async (): Promise<ICompaniesResult[]> => {
  const api = await fetch(`${BACKEND_API}/companies`, {
    method: 'GET'
  })

  const data: ICompaniesResult[] = await api.json()
  return data
}