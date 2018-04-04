import * as React from "react";
import { IStudent } from "../shared/IStudent";

import "../../styles/Student.less";

export interface StudentProperties {
    student: IStudent;
    index: number;
    onEditStudent(id: IStudent): void;
}

const Student: React.StatelessComponent<StudentProperties> = (value: StudentProperties) => {
    return <tr>
        <th scope="row">{value.index}</th>
        <td>
            {value.student.id}
        </td>
        <td>{value.student.name}</td>
        <td>{value.student.grade}</td>
        <td>
            <a href="#" onClick={() => {
                value.onEditStudent(value.student);
            }}>Edit</a>
        </td>
    </tr>;
};

export default Student;