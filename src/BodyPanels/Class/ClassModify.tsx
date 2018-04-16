import * as React from "React";
import { IClass } from "../../shared/IClass";
import { GradeSelector } from "../../shared/GradeSelector";
import { Constants } from "../../shared/Constants";

export interface ClassModifyProperites {
    classToEdit: IClass;
    authorizationToken: string;
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

        this.onGradeChanged = this.onGradeChanged.bind(this);
    }

    public render() {
        return <div>
            <h2> Edit class </h2>
            <div className="label-class-id-root">
                <span className="label-class-id-title">Id: </span>
                <span>{this.state.classToEdit.id}</span>
            </div>

            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Name</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.state.classToEdit.name}
                    onChange={this.onClassNameInputChanged.bind(this)} />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Semester</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.state.classToEdit.semester}
                    onChange={this.onClassSemesterInputChanged.bind(this)} />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Year</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.state.classToEdit.year}
                    onChange={this.onClassYearInputChanged.bind(this)} />
            </div>
            <div>
                <span>Grade: </span>
                <span>
                    <GradeSelector onStudentGradeChanged={this.onGradeChanged} studentGrade={this.state.classToEdit.eligibleToGrade} />
                </span>
            </div>
            <button type="button" onClick={this.onSubmitNewClassDetails.bind(this)} className="btn btn-secondary cx-margin-top">Save</button>
            <div>{this.state.putResponse}</div>
        </div>;
    }

    private onGradeChanged(studentGrade: string) {
        this.setState((prevState: ClassModifyState) => {
            const classToEdit: IClass = Object.assign({}, prevState.classToEdit);
            classToEdit.eligibleToGrade = studentGrade;
            return { classToEdit };
        });
    }

    private onSubmitNewClassDetails() {
        this.setState((prevState: ClassModifyState) => {
            const networkClassObject: Object = {
                Name: this.state.classToEdit.name,
                Semester: this.state.classToEdit.semester,
                Id: this.state.classToEdit.id,
                Year: this.state.classToEdit.year,
                EligibleToGrade: this.state.classToEdit.eligibleToGrade,
            };
            const classId: string = this.state.classToEdit.id;

            fetch(Constants.BackendUri + "class?Id=" + classId, {
                body: JSON.stringify(networkClassObject),
                headers: {
                    "content-type": "application/json",
                    "sm-authorization-header": this.props.authorizationToken || ""
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