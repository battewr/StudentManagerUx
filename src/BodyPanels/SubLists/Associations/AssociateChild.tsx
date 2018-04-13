import * as React from "React";
import { Constants } from "../../../shared/Constants";
import { IRawStudent, IEligibilityContract } from "../../../shared/RawRestInterfaces";
import { IStudent } from "../../../shared/IStudent";
import { List, ListColumnDefinition } from "../../../shared/Components/List";
import { IGuardian } from "../../../shared/IGuardian";

import "../../../../styles/MainShared.less";
import "../../../../styles/AvailableStudentForRegistration.less";

class AssociateChildListContainer extends List<IStudent> { }

export interface AssociateChildProperties {
    studentList: IStudent[];
    guardianSelected: IGuardian;
    onEditTargetChanged(newGuardian: IGuardian): void;
}

export interface AssociateChildState {
    isLoading: boolean;
    error: string;
    pageSize: number;
    currentPageIndex: number;
    estimatedLength: number;
}

interface Map<T> {
    [key: string]: T;
}

export class AssociateChild extends React.Component<AssociateChildProperties,
    AssociateChildState> {

    public constructor(props: AssociateChildProperties) {
        super(props);

        this.state = {
            isLoading: false,
            error: null,
            pageSize: 10,
            currentPageIndex: 0,
            estimatedLength: 0,
        };
    }

    public render(): JSX.Element {
        if (!this.props.studentList) {
            return null;
        }

        const studentHash: Map<IStudent> = {};
        this.props.guardianSelected.studentList.forEach((student) => {
            studentHash[student.id] = student;
        });

        const eligibleStudentList: IStudent[] = [];
        this.props.studentList.forEach((student) => {
            if (!studentHash.hasOwnProperty(student.id)) {
                eligibleStudentList.push(student);
            }
        });

        return <div className="modal fade" id="guardian-association-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Candidate Attendees</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {this.renderEligibleStudentListTable(eligibleStudentList)}
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

    private renderEligibleStudentListTable(eligibleStudents: IStudent[]): JSX.Element {
        return <AssociateChildListContainer
            data={eligibleStudents}
            columns={this.makeColumns()} />;
    }

    private makeColumns(): ListColumnDefinition<IStudent>[] {
        const columns: ListColumnDefinition<IStudent>[] = [];
        columns.push({
            titleDisplayValue: "Name",
            renderer: (student: IStudent): JSX.Element => {
                return <div className="cx-padding-top">{student.name}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Actions",
            renderer: (student: IStudent): JSX.Element => {
                return <button type="button" className="btn btn-info btn-sm" onClick={() => {
                    this.associateChildToGuardian(student);
                }}>+</button>;
            }
        });
        return columns;
    }

    private associateChildToGuardian(newStudent: IStudent) {
        fetch(Constants.BackendUri + `assign?Id=${this.props.guardianSelected.id}&StudentId=${newStudent.id}`, {
            headers: {
                "content-type": "application/json"
            },
            method: "PUT",
        }).then((response) => {
            if (response.status !== 200) {
                this.setState({ isLoading: false, error: "failed association with state " + response.status });
                return;
            }

            const mutatedStudentList: IStudent[] = Object.assign([], this.props.guardianSelected.studentList);
            const newGuardian: IGuardian = Object.assign({}, this.props.guardianSelected);
            newGuardian.studentList = mutatedStudentList;
            mutatedStudentList.push(newStudent);

            this.props.onEditTargetChanged(newGuardian);

        }).catch((err) => {
            this.setState({ isLoading: false, error: err });
        });
    }
}
