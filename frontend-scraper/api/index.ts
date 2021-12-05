import { Website } from "types";
import { IJobs, IShowResultJobTypes } from "types/api";

type IGetJobParams = {
  job_type: string
} & Pick<IJobs, 'min'> & Pick<IJobs, 'max'>

export type ICompaniesResult = Pick<Website, 'id' | 'title'>;

const BACKEND_API = `http://localhost:8080`;

export const getJobTypes = async (): Promise<IShowResultJobTypes> => {
  const api = await fetch(`${BACKEND_API}/job_types`, {
    method: "GET",
  });

  const data: IShowResultJobTypes = await api.json();
  return data;
}

export const getJobType = async ({ job_type, max, min }: IGetJobParams): Promise<IJobs[]> => {
  const api = await fetch(`${BACKEND_API}/job_type/${job_type}?min=${min}&max=${max}`, {
    method: "GET"
  });

  const data: IJobs[] = await api.json();
  return data;
}

export const getCompanies = async (): Promise<ICompaniesResult[]> => {
  const api = await fetch(`${BACKEND_API}/companies`, {
    method: "GET"
  })

  const data: ICompaniesResult[] = await api.json()
  return data
}

export const getAllJobs = async (): Promise<IJobs[]> => {
  const api = await fetch(`${BACKEND_API}/jobs`, {
    method: "GET"
  })

  const data: IJobs[] = await api.json();
  return data;
}