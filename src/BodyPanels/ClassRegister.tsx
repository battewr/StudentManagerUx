import * as React from "React";
import * as uuid from "uuid";
import { Constants } from "../shared/Constants";

import "../../styles/Shared.less";
import { GradeSelector } from "../shared/GradeSelector";


export interface ClassRegisterProperties {

}

export interface ClassRegisterState {
    name: string;
    semester: string;
    year: string;
    eligibleGrade: string;
    postResult: string;
}

export class ClassRegister extends React.Component<ClassRegisterProperties, ClassRegisterState> {
    constructor(props: any) {
        super(props);

        this.state = {
            name: "",
            semester: "",
            year: "",
            eligibleGrade: "K",
            postResult: null,
        };

        this.onGradeChanged = this.onGradeChanged.bind(this);
    }

    /**
     * TODO: Cleanup the styles... after refactor I broke where all these belong
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="create-class-container">
            <h2 className="unselectable"> Register a new Class! </h2>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.state.name}
                    onChange={this.onClassNameInputChanged.bind(this)} />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Semester</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.state.semester}
                    onChange={this.onClassSemesterInputChanged.bind(this)} />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Year</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.state.year}
                    onChange={this.onclassYearInputChanged.bind(this)} />
            </div>
            <div className="class-eligible-to-input">
                <span className="class-eligible-to-input-title">Eligible To: </span>
                <span className="class-eligible-to-input-text">
                    <GradeSelector onStudentGradeChanged={this.onGradeChanged} studentGrade={this.state.eligibleGrade} />
                </span>
            </div>
            <button type="button" onClick={this.onSubmitNewclass.bind(this)}
                className="btn btn-secondary margin-top">Create Class</button>
            {this.renderPostResult()}</div>;
    }

    private onGradeChanged(eligibleGrade: string): void {
        this.setState({ eligibleGrade });
    }

    /**
     * @returns {}
     */
    private renderPostResult(): JSX.Element {
        if (!this.state.postResult) {
            return null;
        }

        return <div className="create-class-post-result">
            <span>{this.state.postResult}</span>
        </div>;
    }

    /**
     * not safe to directly access this.state here... changes to state may be pending....
     * TODO: check into how to do this properly?
     */
    private onSubmitNewclass() {
        this.setState({}, () => {
            const newclassId = uuid().toString();
            const networkClassObject: Object = {
                Name: this.state.name,
                Semester: this.state.semester,
                Year: this.state.year,
                EligibleToGrade: this.state.eligibleGrade,
                Id: newclassId,
            };

            fetch(Constants.BackendUri + "class", {
                body: JSON.stringify(networkClassObject),
                headers: {
                    "content-type": "application/json"
                },
                method: "POST",
            }).then((response) => {
                this.setState({ postResult: `Finished: ${response.status.toString()} : ${response.statusText} : ${newclassId}` });
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
    private onClassNameInputChanged(event: any): void {
        if (!event || !event.target || !event.target.value ||
            typeof event.target.value !== "string") {
            this.setState({ name: "" });
        }
        this.setState({ name: event.target.value });
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onClassSemesterInputChanged(event: any): void {
        if (!event || !event.target || !event.target.value ||
            typeof event.target.value !== "string") {
            this.setState({ semester: "" });
        }
        this.setState({ semester: event.target.value });
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onclassYearInputChanged(event: any): void {
        if (!event || !event.target || !event.target.value ||
            typeof event.target.value !== "string") {
            this.setState({ year: "" });
        }
        this.setState({ year: event.target.value });
    }
};