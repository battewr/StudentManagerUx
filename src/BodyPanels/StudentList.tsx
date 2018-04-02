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
    studentList: IRawStudent[];
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
            response.json().then((studentList: IRawStudent[]) => {
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
            {this.renderStudentList()}
        </div>;
    }

    private renderStudentList(): JSX.Element[] {
        if (this.state.isLoading) {
            return [<div className="student-list-conent-loading">Loading...</div>];
        } else if (!!this.state.error) {
            return [<div className="student-list-content-load-failed">Error: {this.state.error}</div>];
        } else {
            if (!this.state.studentList) {
                return [<div className="unknown-error">Unknown Exception</div>];
            }
            const studentListContent: JSX.Element[] = [];
            this.state.studentList.forEach((student: IRawStudent) => {
                const mappedStudent = this.convertRawStudentToInternalStudent(student);
                const studentDomEntry: JSX.Element = <div className="student-section">
                    <Student student={mappedStudent} onEditStudent={this.props.onEditStudent} />
                </div>;
                studentListContent.push(studentDomEntry);
            });

            return studentListContent;
        }
    }

    private convertRawStudentToInternalStudent(rawStudent: IRawStudent): IStudent {
        return {
            id: rawStudent._id,
            name: rawStudent._name,
            grade: rawStudent._grade
        };
    }
};