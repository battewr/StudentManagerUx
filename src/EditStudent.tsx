import * as React from "React";
import { IStudent } from "./shared/IStudent";
import { GradeSelector } from "./shared/GradeSelector";

export interface EditStudentProperites {
    studentToEdit: IStudent;
}

export interface EditStudentState {
    studentToEdit: IStudent;
}

export class EditStudent extends React.Component<EditStudentProperites, EditStudentState> {

    constructor(props: EditStudentProperites) {
        super(props);

        this.state = {
            studentToEdit: Object.assign({}, props.studentToEdit)
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
                    <input type="text" value={this.state.studentToEdit.name} />
                </span>
            </div>
            <div>
                <span>Grade: </span>
                <span>
                    <GradeSelector onStudentGradeChanged={this.onGradeChanged} studentGrade={this.state.studentToEdit.grade} />
                </span>
            </div>
        </div>;
    }

    private onGradeChanged(studentGrade: string) {
        this.setState((prevState: EditStudentState) => {
            const studentToEdit: IStudent = Object.assign({}, prevState.studentToEdit);
            studentToEdit.grade = studentGrade;
            return {studentToEdit};
        });
    }
}