import * as React from "React";
import * as uuid from "uuid";
import { Constants } from "../shared/Constants";

import "../../styles/Shared.less";


export interface ClassRegisterProperties {

}

export interface ClassRegisterState {
    name: string;
    semester: string;
    year: string;
    postResult: string;
}

export class ClassRegister extends React.Component<ClassRegisterProperties, ClassRegisterState> {
    constructor(props: any) {
        super(props);

        this.state = {
            name: "",
            semester: "",
            year: "",
            postResult: null,
        };
    }

    /**
     * TODO: Cleanup the styles... after refactor I broke where all these belong
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="create-class-container">
            <h2 className="unselectable"> Register a new Class! </h2>
            <div className="class-name-input">
                <span className="class-name-input-title">Name: </span>
                <span className="class-name-input-text"><input type="text" placeholder="New Class Name" value={this.state.name}
                    onChange={this.onClassNameInputChanged.bind(this)} /></span>
            </div>
            <div className="class-name-input">
                <span className="class-name-input-title">Semester: </span>
                <span className="class-name-input-text"><input type="text" placeholder="New Class Semester" value={this.state.semester}
                    onChange={this.onClassSemesterInputChanged.bind(this)} /></span>
            </div>
            <div className="class-name-input">
                <span className="class-name-input-title">Year: </span>
                <span className="class-name-input-text"><input type="text" placeholder="New Class Year" value={this.state.year}
                    onChange={this.onclassYearInputChanged.bind(this)} /></span>
            </div>
            <button onClick={this.onSubmitNewclass.bind(this)}>Submit</button>
            {this.renderPostResult()}</div>;
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