import * as React from "React";
import { IClass } from "../shared/IClass";
import { Constants } from "../shared/Constants";
import { IRawStudent } from "../shared/RawRestInterfaces";
import { IStudent } from "../shared/IStudent";

import "../../styles/AvailableStudentForRegistration.less";

export interface RegisterStudentProperties {
    classSelected: IClass;
    onEditTargetChanged(newClass: IClass): void;
}

export interface RegisterStudentState {
    isLoading: boolean;
    error: string;
    eligibleStudentList: IStudent[];
}

export class RegisterStudent extends React.Component<RegisterStudentProperties,
    RegisterStudentState> {

    public constructor(props: RegisterStudentProperties) {
        super(props);

        this.state = {
            isLoading: false,
            error: null,
            eligibleStudentList: null,
        };
    }

    public componentDidMount() {
        $("#register-student-modal").on("shown.bs.modal", () => {
            this.onModalLoad();
        });
    }

    private onModalLoad() {
        // TODO rest request... to retreive the students who aren"t in this class
        fetch(Constants.BackendUri + `eligibility?Id=${this.props.classSelected.id}`, {
            headers: {
                "content-type": "application/json"
            },
            method: "GET",
        }).then((response) => {

            if (response.status !== 200) {
                this.setState({ isLoading: false, error: "failed rest with state " + response.status, eligibleStudentList: null });
                return;
            }

            response.json().then((rawStudentList: IRawStudent[]) => {
                const eligibleStudentList: IStudent[] = this.convertToStudentList(rawStudentList);
                this.setState({ isLoading: false, error: null, eligibleStudentList });
            }).catch((err) => {
                this.setState({ isLoading: false, error: err.message, eligibleStudentList: null });
            });
        }).catch((err) => {
            this.setState({ isLoading: false, error: err, eligibleStudentList: null });
        });
    }

    public render(): JSX.Element {
        return <div className="modal fade" id="register-student-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Candidate Attendees</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {this.renderEligibleStudentList()}
                    </div>
                </div>
            </div>
        </div>;
    }

    private convertToStudentList(rawStudentList: IRawStudent[]): IStudent[] {
        const convertedStudentList: IStudent[] = [];
        rawStudentList.forEach((rawStudent) => {
            convertedStudentList.push(this.convertRawStudentToInternalStudent(rawStudent));
        });
        return convertedStudentList;
    }

    private convertRawStudentToInternalStudent(rawStudent: IRawStudent): IStudent {
        return {
            id: rawStudent._id,
            name: rawStudent._name,
            grade: rawStudent._grade
        };
    }

    private renderEligibleStudentList(): JSX.Element {
        const studentEntries: JSX.Element[] = [];

        if (!this.state.eligibleStudentList) {
            return null;
        }

        this.state.eligibleStudentList.forEach((student, index) => {
            studentEntries.push(<tr>
                <th scope="row">{index}</th>
                <td>{student.name}</td>
                <td>
                    <button onClick={() => {
                        this.addStudentToClass(student);
                    }}>+</button>
                </td>
            </tr>);
        });

        return <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {studentEntries}
            </tbody>
        </table>;
    }

    private addStudentToClass(newStudent: IStudent) {
        fetch(Constants.BackendUri + `attendence?Id=${this.props.classSelected.id}&StudentId=${newStudent.id}`, {
            headers: {
                "content-type": "application/json"
            },
            method: "PUT",
        }).then((response) => {

            if (response.status !== 200) {
                this.setState({ isLoading: false, error: "failed association with state " + response.status, eligibleStudentList: null });
                return;
            }

            // bbax: first we need to update the state of this component so this student isn"t available to
            // be added to the class over and over again...
            this.setState((prevState: RegisterStudentState) => {
                // bbax: deep copy the student list being used for eligibility (React requirement for immutable state)
                const eligibleStudentList: IStudent[] = Object.assign([], prevState.eligibleStudentList);

                // bbax: remove the student from teh eligibility list... (200 means he is in the list)
                const studentIndex = eligibleStudentList.indexOf(newStudent);
                eligibleStudentList.splice(studentIndex, 1);

                // bbax: update state
                return { eligibleStudentList, isLoading: false, error: null };
            }, () => {

                // bbax: once react has settled the internal state... we need to tell Body.tsx that the classToEdit
                // has changed... not that the class itself has changed, but due to immutability for react we have
                // deep cloned the edit class and modified the student list in this clone
                const newClass: IClass = Object.assign({}, this.props.classSelected);
                newClass.studentList = Object.assign([], newClass.studentList);

                // bbax: add student to the cloned list
                newClass.studentList.push(newStudent);

                // bbax: alert out to anyone listening that this changed
                this.props.onEditTargetChanged(newClass);
            });
        }).catch((err) => {
            this.setState({ isLoading: false, error: err, eligibleStudentList: null });
        });
    }
}
