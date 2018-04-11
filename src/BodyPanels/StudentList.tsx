import * as React from "React";
import { Constants } from "../shared/Constants";
import { IStudent } from "../shared/IStudent";
import { IRawStudent } from "../shared/RawRestInterfaces";
import { List, ListColumnDefinition } from "../shared/Components/List";

import "../../styles/MainShared.less";

class StudentListContainer extends List<IStudent> { }

export interface StudentListProperties {
    onEditStudent(studentId: IStudent): void;
}

export interface StudentListState {
    isLoading: boolean;
    error: string;
    studentList: IStudent[];
}

/**
 *
 */
export class StudentList extends React.Component<StudentListProperties, StudentListState> {
    /**
     *
     * @param props
     */
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            error: null,
            studentList: null
        };
    }

    public componentDidMount() {
        // trigger the rest request...
        fetch(Constants.BackendUri + "students", {
            headers: {
                "content-type": "application/json"
            },
            method: "GET",
        }).then((response) => {
            response.json().then((rawStudentList: IRawStudent[]) => {
                const studentList: IStudent[] = [];
                rawStudentList.forEach((rawStudent) => {
                    const mappedStudent = this.convertRawStudentToInternalStudent(rawStudent);
                    studentList.push(mappedStudent);
                });
                this.setState({ isLoading: false, error: null, studentList });
            }).catch((err) => {
                this.setState({ isLoading: false, error: err.message, studentList: null });
            });
        }).catch((err) => {
            this.setState({ isLoading: false, error: err, studentList: null });
        });
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="student-list-container">
            <h2>Student List</h2>
            {this.renderStudentList()}
        </div>;
    }

    private renderStudentList(): JSX.Element {
        return <StudentListContainer
            data={this.state.studentList}
            columns={this.makeColumns()} />;
    }

    private makeColumns(): ListColumnDefinition<IStudent>[] {
        const columns: ListColumnDefinition<IStudent>[] = [];
        columns.push({
            titleDisplayValue: "Name",
            renderer: (student: IStudent): JSX.Element => {
                return <div className="cx-padding-top">{student.name}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Id",
            renderer: (student: IStudent): JSX.Element => {
                return <div className="cx-padding-top">{student.id}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Grade",
            renderer: (student: IStudent): JSX.Element => {
                return <div className="cx-padding-top">{student.grade}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Actions",
            renderer: (student: IStudent): JSX.Element => {
                return <div>
                    <button type="button" className="btn btn-info btn-sm" onClick={() => {
                        this.props.onEditStudent(student);
                    }}>Edit</button>&nbsp;
                    <button type="button" className="btn btn-info btn-sm" onClick={() => {
                        this.deleteStudent(student);
                    }}>Delete</button></div>;
            }
        });
        return columns;
    }

    private deleteStudent(student: IStudent) {
        fetch(Constants.BackendUri + `student?Id=${student.id}`, {
            headers: {
                "content-type": "application/json"
            },
            method: "DELETE",
        }).then((response) => {
            if (response.status !== 200) {
                // TODO: REST response
                alert(`Delete student failed : ${response.status} : ${response.body}`);
                return;
            }
            this.setState((prevState: StudentListState) => {
                const newStudentList: IStudent[] = Object.assign([], prevState.studentList);
                const studentIndex = newStudentList.findIndex((value) => { return value.id === student.id; });
                newStudentList.splice(studentIndex, 1);
                return { studentList: newStudentList };
            });
        }).catch((err) => {
            // TODO: REST response
            alert("Delete student failed " + err.message);
        });
    }

    private convertRawStudentToInternalStudent(rawStudent: IRawStudent): IStudent {
        return {
            id: rawStudent._id,
            name: rawStudent._name,
            grade: rawStudent._grade
        };
    }
};