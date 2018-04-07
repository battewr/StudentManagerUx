import * as React from "React";
import { IStudent } from "../shared/IStudent";
import { GradeSelector } from "../shared/GradeSelector";
import { Constants } from "../shared/Constants";

import "../../styles/StudentModify.less";

export interface StudentModifyProperites {
    studentToEdit: IStudent;
}

export interface StudentModifyState {
    studentToEdit: IStudent;
    putResponse: string;
}

export class StudentModify extends React.Component<StudentModifyProperites, StudentModifyState> {

    constructor(props: StudentModifyProperites) {
        super(props);

        this.state = {
            studentToEdit: Object.assign({}, props.studentToEdit),
            putResponse: null,
        };

        this.onGradeChanged = this.onGradeChanged.bind(this);
    }

    public render() {
        return <div>
            <h2> Edit Student </h2>
            <div className="label-class-id-root">
                <span className="label-class-id-title">Id: </span>
                <span>{this.state.studentToEdit.id}</span>
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.state.studentToEdit.name}
                    onChange={this.onStudentNameInputChanged.bind(this)} />
            </div>
            <div>
                <span>Grade: </span>
                <span>
                    <GradeSelector onStudentGradeChanged={this.onGradeChanged} studentGrade={this.state.studentToEdit.grade} />
                </span>
            </div>
            <button type="button" onClick={this.onSubmitNewStudentDetails.bind(this)} className="btn btn-secondary margin-top">Save</button>
            <div>{this.state.putResponse}</div>
        </div>;
    }

    private onSubmitNewStudentDetails() {
        this.setState((prevState: StudentModifyState) => {
            const networkStudentObject: Object = {
                Name: this.state.studentToEdit.name,
                Grade: this.state.studentToEdit.grade,
                Id: this.state.studentToEdit.id,
                ProfilePicture: "",
            };
            const studentId: string = this.state.studentToEdit.id;

            fetch(Constants.BackendUri + "student?Id=" + studentId, {
                body: JSON.stringify(networkStudentObject),
                headers: {
                    "content-type": "application/json"
                },
                method: "PUT",
            }).then((response) => {
                this.setState({ putResponse: `Finished: ${response.status.toString()} : ${response.statusText} : ${studentId}` });
            }).catch((err) => {
                this.setState({ putResponse: `Post Error: ${err}` });
            });
        });
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onStudentNameInputChanged(event: any): void {
        let studentName: string = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
            studentName = event.target.value;
        }

        this.setState((prevState: StudentModifyState) => {
            const studentToEdit: IStudent = Object.assign({}, prevState.studentToEdit);
            studentToEdit.name = studentName;
            return { studentToEdit };
        });
    }

    private onGradeChanged(studentGrade: string) {
        this.setState((prevState: StudentModifyState) => {
            const studentToEdit: IStudent = Object.assign({}, prevState.studentToEdit);
            studentToEdit.grade = studentGrade;
            return { studentToEdit };
        });
    }
}