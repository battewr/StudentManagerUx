import * as React from "React";
import { IStudent } from "../shared/IStudent";
import { GradeSelector } from "../shared/GradeSelector";
import { Constants } from "../shared/Constants";

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
            <div>
                <span>Id: </span>
                <span>{this.state.studentToEdit.id}</span>
            </div>
            <div>
                <span>Name: </span>
                <span>
                    <input type="text" value={this.state.studentToEdit.name} onChange={this.onStudentNameInputChanged.bind(this)} />
                </span>
            </div>
            <div>
                <span>Grade: </span>
                <span>
                    <GradeSelector onStudentGradeChanged={this.onGradeChanged} studentGrade={this.state.studentToEdit.grade} />
                </span>
            </div>
            <button onClick={this.onSubmitNewStudentDetails.bind(this)}>Submit</button>
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