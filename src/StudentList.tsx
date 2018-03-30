import * as React from "React";
import { Constants } from "./shared/Constants";
import Student from "./Student";

import "../styles/Shared.less";

interface IStudent {
    _name: string;
    _id: string;
    _grade: string;
    _profilePictureLink: string;
}

export interface StudentListProperties {

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
            console.log(response);
            response.json().then((studentList: IStudent[]) => {
                this.setState({isLoading: false, error: null, studentList});
            }).catch((err) => {
                this.setState({isLoading: false, error: err, studentList: null});
            });
        }).catch((err) => {
            this.setState({isLoading: false, error: err, studentList: null});
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
            this.state.studentList.forEach((student) => {
                const studentDomEntry: JSX.Element = <div><Student name={student._name} id={student._id} grade={student._grade} /></div>;
                studentListContent.push(studentDomEntry);
            });

            return studentListContent;
        }
    }
};