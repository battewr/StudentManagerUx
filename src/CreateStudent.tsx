import * as React from "React";
import * as uuid from "uuid";
import { Constants } from "./shared/Constants";

import "../styles/Shared.less";

interface GradeSelectionWrapper {
    value: string;
    displayString: string;
}

const availableGrades: GradeSelectionWrapper[] = [
    { value: "K", displayString: "Kindergarden" },
    { value: "1", displayString: "Grade 1" },
    { value: "2", displayString: "Grade 2" },
    { value: "3", displayString: "Grade 3" },
    { value: "4", displayString: "Grade 4" },
    { value: "5", displayString: "Grade 5" },
    { value: "6", displayString: "Grade 6" },
    { value: "7", displayString: "Grade 7" },
    { value: "8", displayString: "Grade 8" },
    { value: "9", displayString: "Grade 9" },
    { value: "10", displayString: "Grade 10" },
    { value: "11", displayString: "Grade 11" },
    { value: "12", displayString: "Grade 12" }
];

export interface CreateStudentProperties {

}

export interface CreateStudentState {
    studentName: string;
    studentGrade: string;
    postResult: string;
}

export class CreateStudent extends React.Component<CreateStudentProperties, CreateStudentState> {
    constructor(props: any) {
        super(props);

        this.state = {
            studentName: "",
            studentGrade: "K",
            postResult: null,
        };
    }

    /**
     * TODO: Cleanup the styles... after refactor I broke where all these belong
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const menuItemClass = "right-menu-panel-menu-option unselectable";
        return <div><h2 className="unselectable"> Create a new Student! </h2>
            <div className="student-name-input">
                <span className="student-name-input-title">Student Name: </span>
                <span className="student-name-input-text"><input type="text" placeholder="New Student Name" value={this.state.studentName}
                    onChange={this.onStudentNameInputChanged.bind(this)} /></span>
            </div>
            <div className="student-grade-input">
                <span className="student-grade-input-title">Student Grade: </span>
                <span className="student-grade-input-text">
                    {/** TODO: make the backend given us information regarding which grades are possible */}
                    <select value={this.state.studentGrade} onChange={this.onStudentGradeInputChanged.bind(this)}>
                        {this.getOptionList()}
                    </select>
                </span>
            </div>
            <button onClick={this.onSubmitNewStudent.bind(this)}>Submit</button>
            {this.renderPostResult()}</div>;
    }

    /**
     * @returns {}
     */
    private renderPostResult(): JSX.Element {
        if (!this.state.postResult) {
            return null;
        }

        return <div className="create-student-post-result">
            <span>{this.state.postResult}</span>
        </div>;
    }

    /**
     *
     * @returns {JSX.Element[]}
     */
    private getOptionList(): JSX.Element[] {
        const returnList: JSX.Element[] = [];

        availableGrades.forEach((grade) => {
            returnList.push(
                <option selected={this.state.studentGrade === grade.value} value={grade.value}>
                    {grade.displayString}
                </option>);
        });

        return returnList;
    }

    /**
     * not safe to directly access this.state here... changes to state may be pending....
     * TODO: check into how to do this properly?
     */
    private onSubmitNewStudent() {
        this.setState({}, () => {
            const newStudentId = uuid().toString();
            const networkStudentObject: Object = {
                Name: this.state.studentName,
                Grade: this.state.studentGrade,
                Id: newStudentId,
                ProfilePicture: "",
            };

            fetch(Constants.BackendUri + "student", {
                body: JSON.stringify(networkStudentObject),
                headers: {
                    "content-type": "application/json"
                },
                method: "POST",
            }).then((response) => {
                this.setState({ postResult: `Finished: ${response.status.toString()} : ${response.statusText} : ${newStudentId}` });
            }).catch((err) => {
                this.setState({ postResult: `Post Error: ${err}` });
            });
        });
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onStudentGradeInputChanged(event: any): void {
        if (!event || !event.target || !event.target.value ||
            typeof event.target.value !== "string") {
            throw "Input type unexpected!";
        }
        this.setState({ studentGrade: event.target.value });
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onStudentNameInputChanged(event: any): void {
        if (!event || !event.target || !event.target.value ||
            typeof event.target.value !== "string") {
            throw "Input type unexpected!";
        }
        this.setState({ studentName: event.target.value });
    }
};