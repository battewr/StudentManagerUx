import * as React from "react";
import { IClass } from "../shared/IClass";

import "../../styles/Class.less";

export interface ClassProperties {
    class: IClass;
    onEditClass(classToEdit: IClass): void;
    onEditClassList(classToEdit: IClass): void;
}

const Class: React.StatelessComponent<ClassProperties> = (value: ClassProperties) => {
    return <div className="class-container">
        <div className="class-id-container">
            <span className="class-id-label">Id: </span>
            <span className="class-id-value">{value.class.id}</span>
            <a href="#" onClick={() => {
                value.onEditClass(value.class);
            }}>Edit</a>
            <a href="#" onClick={() => {
                value.onEditClassList(value.class);
            }}>Attendee List</a>
        </div>
        <div className="class-name-container">
            <span className="class-name-label">Class Name:</span>
            <span className="class-name-value">{value.class.name}</span>
        </div>
        <div className="class-name-container">
            <span className="class-grade-label">Semester:</span>
            <span className="class-grade-value">{value.class.semester}</span>
        </div>
        <div className="class-eligiblity-container">
            <span className="class-eligiblity-label">Eligible To: </span>
            <span className="class-eligiblity-value">{value.class.eligibleToGrade}</span>
        </div>
        <div className="class-name-container">
            <span className="class-grade-label">Year:</span>
            <span className="class-grade-value">{value.class.year}</span>
        </div>
    </div>;
};

export default Class;