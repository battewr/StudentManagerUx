import * as React from "react";
import { IStudent } from "../shared/IStudent";

import "../../styles/Student.less";

export interface StudentProperties {
    student: IStudent;
    onEditStudent(id: IStudent): void;
}

const Student: React.StatelessComponent<StudentProperties> = (value: StudentProperties) => {
    return <div className="student-container">
        <div className="student-id-container">
            <span className="student-id-label">Id: </span>
            <span className="student-id-value">{value.student.id}</span>
            <a href="#" onClick={() => {
                value.onEditStudent(value.student);
            }}>Edit</a>
        </div>
        <div className="student-name-container">
            <span className="student-name-label">Student Name:</span>
            <span className="student-name-value">{value.student.name}</span>
        </div>
        <div className="student-name-container">
            <span className="student-grade-label">Grade:</span>
            <span className="student-grade-value">{value.student.grade}</span>
        </div>
    </div>;
};

export default Student;