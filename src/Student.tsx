import * as React from "react";

export interface StudentProperties {
    name: string;
    id: string;
    grade: string;
}

const Student: React.StatelessComponent<StudentProperties> = (value: StudentProperties) => {
    return <div>
        <div>
            <span>Id: </span>
            <span>{value.id}</span>
        </div>
        <div>
            <span>Student Name:</span>
            <span>{value.name}</span>
        </div>
        <div>
            <span>Grade:</span>
            <span>{value.grade}</span>
        </div>
    </div>;
};

export default Student;