import * as React from "React";
import { Constants } from "../shared/Constants";
import Student from "./Student";
import { IStudent } from "../shared/IStudent";
import { IRawStudent } from "../shared/RawRestInterfaces";

import "../../styles/Shared.less";

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
        const studentRenderedList: JSX.Element[] = [];

        if (this.state.studentList) {
            this.state.studentList.forEach((student, index) => {
                studentRenderedList.push(
                    <Student
                        index={index}
                        student={student}
                        onEditStudent={this.props.onEditStudent} />);
            });
        }

        return <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Id</th>
                    <th scope="col">Name</th>
                    <th scope="col">Grade</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {studentRenderedList}
            </tbody>
        </table>;
    }

    private convertRawStudentToInternalStudent(rawStudent: IRawStudent): IStudent {
        return {
            id: rawStudent._id,
            name: rawStudent._name,
            grade: rawStudent._grade
        };
    }
};