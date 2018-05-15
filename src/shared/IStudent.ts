import { IBaseEditTarget } from "../Model/Layout";
export interface IStudent extends IBaseEditTarget {
    name: string;
    id: string;
    grade: string;
};