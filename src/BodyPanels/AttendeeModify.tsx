import * as React from "react";
import { IClass } from "../shared/IClass";
import { IStudent } from "../shared/IStudent";
import { Constants } from "../shared/Constants";
import { RegisterStudent } from "./RegisterStudent";

import "../../styles/AttendenceModifications.less";

export interface AttendeeModifyProperties {
    classToEdit: IClass;
    onEditTargetChanged(alteredClass: IClass): void;
}

export interface AttendeeModifyState {
    restEngineResult: string;
    showAddStudentUserInterface: boolean;
}

export class AttendeeModify extends React.Component<AttendeeModifyProperties, AttendeeModifyState> {
    constructor(props: AttendeeModifyProperties) {
        super(props);

        this.state = {
            restEngineResult: null,
            showAddStudentUserInterface: false,
        };
    }

    public render(): JSX.Element {
        return <div className="attendence-modification-container">
            <h2>Modify Class Registrations</h2>

            {this.renderAvailableStudentsInterface()}

            <div>
                <button onClick={() => { this.setState({ showAddStudentUserInterface: true }); }}>
                    Add Student
                </button>
            </div>
            {this.renderClassContainerDetails()}

            {this.renderClassList()}

            <div>{this.state.restEngineResult}</div>
        </div>;
    }

    private renderAvailableStudentsInterface(): JSX.Element {
        if (!this.state.showAddStudentUserInterface) {
            return null;
        }

        return <RegisterStudent
            classSelected={this.props.classToEdit}
            onEditTargetChanged={this.props.onEditTargetChanged}
            onClose={() => { this.setState({ showAddStudentUserInterface: false }); }} />;
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
            this.setState((prevState: AttendeeModifyState) => {
                const classItem: IClass = Object.assign({}, this.props.classToEdit);
                const studentIndex = classItem.studentList.indexOf(student);

                classItem.studentList.splice(studentIndex, 1);
                return { restEngineResult: null };
            });
        }).catch((err) => {
            // show error message
            this.setState({ restEngineResult: err });
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