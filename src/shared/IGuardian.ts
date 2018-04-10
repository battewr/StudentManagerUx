import { IStudent } from "./IStudent";

export interface IGuardian {
    name: string;
    id: string;
    email: string;

    studentList: IStudent[];
};