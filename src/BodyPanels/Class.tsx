import * as React from "react";
import { IClass } from "../shared/IClass";

import "../../styles/Class.less";

export interface ClassProperties {
    class: IClass;
    index: number;
    onEditClass(classToEdit: IClass): void;
    onEditClassList(classToEdit: IClass): void;
}

const Class: React.StatelessComponent<ClassProperties> = (value: ClassProperties) => {
    return <tr>
        <th scope="row">{value.index}</th>
        <td>
            {value.class.name}
        </td>
        <td>{value.class.semester}</td>
        <td>{value.class.eligibleToGrade}</td>
        <td>{value.class.year}</td>
        <td>
            <a href="#" onClick={() => {
                value.onEditClass(value.class);
            }}>Edit</a>
            <a href="#" onClick={() => {
                value.onEditClassList(value.class);
            }}>Attendee List</a>
        </td>
    </tr>;
};

export default Class;