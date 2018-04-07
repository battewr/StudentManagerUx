import * as React from "React";
import { Constants } from "../shared/Constants";
import { IStudent } from "../shared/IStudent";
import { IRawStudent } from "../shared/RawRestInterfaces";
import { List, ListColumnDefinition } from "../shared/Components/List";

import "../../styles/Shared.less";

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
                return <span>{student.name}</span>;
            }
        });
        columns.push({
            titleDisplayValue: "Id",
            renderer: (student: IStudent): JSX.Element => {
                return <span>{student.id}</span>;
            }
        });
        columns.push({
            titleDisplayValue: "Grade",
            renderer: (student: IStudent): JSX.Element => {
                return <span>{student.grade}</span>;
            }
        });
        columns.push({
            titleDisplayValue: "Actions",
            renderer: (student: IStudent): JSX.Element => {
                return <div>
                    <a href="#" onClick={() => {
                        this.props.onEditStudent(student);
                    }}>Edit</a></div>;
            }
        });
        return columns;
    }

    private convertRawStudentToInternalStudent(rawStudent: IRawStudent): IStudent {
        return {
            id: rawStudent._id,
            name: rawStudent._name,
            grade: rawStudent._grade
        };
    }
};