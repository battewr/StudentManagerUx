import { IStudent } from "./IStudent";

export interface IClass {
    name: string;
    id: string;
    semester: string;
    year: string;

    studentList: IStudent[];
};