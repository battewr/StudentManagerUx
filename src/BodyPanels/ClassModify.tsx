import * as React from "React";
import { IClass } from "../shared/IClass";
import { Constants } from "../shared/Constants";

export interface ClassModifyProperites {
    classToEdit: IClass;
}

export interface ClassModifyState {
    classToEdit: IClass;
    putResponse: string;
}

export class ClassModify extends React.Component<ClassModifyProperites, ClassModifyState> {

    constructor(props: ClassModifyProperites) {
        super(props);

        this.state = {
            classToEdit: Object.assign({}, props.classToEdit),
            putResponse: null,
        };
    }

    public render() {
        return <div>
            <h2> Edit class </h2>
            <div>
                <span>Id: </span>
                <span>{this.state.classToEdit.id}</span>
            </div>
            <div>
                <span>Name: </span>
                <span>
                    <input type="text" value={this.state.classToEdit.name} onChange={this.onClassNameInputChanged.bind(this)} />
                </span>
            </div>
            <div>
                <span>Semester: </span>
                <span>
                    <input type="text" value={this.state.classToEdit.semester} onChange={this.onClassSemesterInputChanged.bind(this)} />
                </span>
            </div>
            <div>
                <span>Year: </span>
                <span>
                    <input type="text" value={this.state.classToEdit.year} onChange={this.onClassYearInputChanged.bind(this)} />
                </span>
            </div>
            <button onClick={this.onSubmitNewClassDetails.bind(this)}>Submit</button>
            <div>{this.state.putResponse}</div>
        </div>;
    }

    private onSubmitNewClassDetails() {
        this.setState((prevState: ClassModifyState) => {
            const networkClassObject: Object = {
                Name: this.state.classToEdit.name,
                Semester: this.state.classToEdit.semester,
                Id: this.state.classToEdit.id,
                Year: this.state.classToEdit.year,
            };
            const classId: string = this.state.classToEdit.id;

            fetch(Constants.BackendUri + "class?Id=" + classId, {
                body: JSON.stringify(networkClassObject),
                headers: {
                    "content-type": "application/json"
                },
                method: "PUT",
            }).then((response) => {
                this.setState({ putResponse: `Finished: ${response.status.toString()} : ${response.statusText} : ${classId}` });
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
    private onClassNameInputChanged(event: any): void {
        let className: string = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
                className = event.target.value;
        }

        this.setState((prevState: ClassModifyState) => {
            const classToEdit: IClass = Object.assign({}, prevState.classToEdit);
            classToEdit.name = className;
            return { classToEdit };
        });
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onClassSemesterInputChanged(event: any): void {
        let semester: string = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
            semester = event.target.value;
        }

        this.setState((prevState: ClassModifyState) => {
            const classToEdit: IClass = Object.assign({}, prevState.classToEdit);
            classToEdit.semester = semester;
            return { classToEdit };
        });
    }

    /**
     * TODO: this should become a date picker
     * @param event
     * @returns {void}
     */
    private onClassYearInputChanged(event: any): void {
        let year: string = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
            year = event.target.value;
        }

        this.setState((prevState: ClassModifyState) => {
            const classToEdit: IClass = Object.assign({}, prevState.classToEdit);
            classToEdit.year = year;
            return { classToEdit };
        });
    }
}