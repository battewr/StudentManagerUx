import * as React from "React";
import { IClass } from "../shared/IClass";
import { Constants } from "../shared/Constants";
import { IRawStudent, IEligibilityContract } from "../shared/RawRestInterfaces";
import { IStudent } from "../shared/IStudent";
import { List, ListColumnDefinition } from "../shared/Components/List";

import "../../styles/Shared.less";
import "../../styles/AvailableStudentForRegistration.less";

class RegisterStudentListContainer extends List<IStudent> { }

export interface RegisterStudentProperties {
    classSelected: IClass;
    onEditTargetChanged(newClass: IClass): void;
}

export interface RegisterStudentState {
    isLoading: boolean;
    error: string;
    eligibleStudentList: IStudent[];

    pageSize: number;
    currentPageIndex: number;
    estimatedLength: number;
}

export class RegisterStudent extends React.Component<RegisterStudentProperties,
    RegisterStudentState> {

    public constructor(props: RegisterStudentProperties) {
        super(props);

        this.state = {
            isLoading: false,
            error: null,
            eligibleStudentList: null,
            pageSize: 10,
            currentPageIndex: 0,
            estimatedLength: 0,
        };
    }

    public componentDidMount() {
        $("#register-student-modal").on("shown.bs.modal", () => {
            this.onModalLoad();
        });
    }

    private onModalLoad() {
        const take = this.state.pageSize;
        const skip = this.state.currentPageIndex * this.state.pageSize;
        // TODO rest request... to retreive the students who aren"t in this class
        fetch(Constants.BackendUri + `eligibility?Id=${this.props.classSelected.id}&take=${take}&skip=${skip}`, {
            headers: {
                "content-type": "application/json"
            },
            method: "GET",
        }).then((response) => {

            if (response.status !== 200) {
                this.setState({ isLoading: false, error: "failed rest with state " + response.status, eligibleStudentList: null });
                return;
            }

            response.json().then((elibility: IEligibilityContract) => {
                const eligibleStudentList: IStudent[] = this.convertToStudentList(elibility.availableAttenenceList);
                this.setState({ isLoading: false, error: null, eligibleStudentList, estimatedLength: elibility.estimatedSize });
            }).catch((err) => {
                this.setState({ isLoading: false, error: err.message, eligibleStudentList: null, estimatedLength: 0, currentPageIndex: 0 });
            });
        }).catch((err) => {
            this.setState({ isLoading: false, error: err, eligibleStudentList: null, estimatedLength: 0, currentPageIndex: 0 });
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
                        {this.renderEligibleStudentListTable()}
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

    private changePage() {
        this.onModalLoad();
    }

    private renderEligibleStudentListTable(): JSX.Element {
        return <RegisterStudentListContainer
            data={this.state.eligibleStudentList}
            columns={this.makeColumns()}
            pageSize={this.state.pageSize}
            selectedPage={this.state.currentPageIndex}
            estimatedMaxItems={this.state.estimatedLength}
            loadPage={(targetIndex: number) => {
                this.setState({ currentPageIndex: targetIndex }, () => {
                    this.onModalLoad();
                });
            }}
        />;
    }

    private makeColumns(): ListColumnDefinition<IStudent>[] {
        const columns: ListColumnDefinition<IStudent>[] = [];
        columns.push({
            titleDisplayValue: "Name",
            renderer: (student: IStudent): JSX.Element => {
                return <div className="padding-top">{student.name}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Actions",
            renderer: (student: IStudent): JSX.Element => {
                return <button type="button" className="btn btn-info btn-sm" onClick={() => {
                    this.addStudentToClass(student);
                }}>+</button>;
            }
        });
        return columns;
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
                this.onModalLoad();
            });
        }).catch((err) => {
            this.setState({ isLoading: false, error: err, eligibleStudentList: null });
        });
    }
}
