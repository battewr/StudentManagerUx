import * as React from "react";
import { IClass } from "../shared/IClass";
import { IStudent } from "../shared/IStudent";

import "../../styles/AttendenceModifications.less";
import { Constants } from "../shared/Constants";

export interface AttendenceModificationProperties {
    classToEdit: IClass;
}

export interface AttendenceModificationState {
    restEngineResult: string;
}

export class AttendenceModification extends React.Component<AttendenceModificationProperties, AttendenceModificationState> {
    constructor(props: AttendenceModificationProperties) {
        super(props);

        this.state = {
            restEngineResult: null
        };
    }

    public render(): JSX.Element {
        return <div className="attendence-modification-container">
            <h2>Modify Class Registrations</h2>
            <div><button>Add Student</button></div>
            {this.renderClassContainerDetails()}

            {this.renderClassList()}

            <div>{this.state.restEngineResult}</div>

        </div>;
    }

    private renderClassList(): JSX.Element {
        const studentList: IStudent[] = this.props.classToEdit.studentList;

        const studentRenderedList: JSX.Element[] = [];
        studentList.forEach((student) => {
            const studentItem = <div className="attendence-modification-student-record">
                <div className="student-id-container">
                    <span className="student-id-label">Id: </span>
                    <span className="student-id-value">{student.id}</span>
                    <a href="#" onClick={() => {
                        this.removeStudentFromClass(this.props.classToEdit.id, student);
                        // value.onEditStudent(value.student);
                    }}>Remove</a>
                </div>
                <div className="student-name-container">
                    <span className="student-name-label">Student Name:</span>
                    <span className="student-name-value">{student.name}</span>
                </div>
            </div>;
            studentRenderedList.push(studentItem);
        });

        return <div className="attendence-modification-student-list">
            {studentRenderedList}
        </div>;
    }

    private removeStudentFromClass(classId: string, student: IStudent) {
        fetch(Constants.BackendUri + `attendence?Id=${classId}&StudentId=${student.id}`, {
            headers: {
                "content-type": "application/json"
            },
            method: "DELETE",
        }).then((response) => {
            // remove list
            this.setState((prevState: AttendenceModificationState) => {
                const classItem: IClass = Object.assign({}, this.props.classToEdit);
                const studentIndex = classItem.studentList.indexOf(student);

                classItem.studentList.splice(studentIndex, 1);
                return {restEngineResult: null};
            });
        }).catch((err) => {
            // show error message
            this.setState({restEngineResult: err});
        });
    }

    private renderClassContainerDetails(): JSX.Element {
        return (<div className="attendence-modification-class-container">
            <div>
                <span>
                    Name:
                </span>
                <span>
                    {this.props.classToEdit.name}
                </span>
            </div>
            <div>
                <span>
                    Year:
                </span>
                <span>
                    {this.props.classToEdit.year}
                </span>
            </div>
            <div>
                <span>
                    Semester:
                </span>
                <span>
                    {this.props.classToEdit.semester}
                </span>
            </div>
        </div>);
    }
}