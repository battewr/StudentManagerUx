import * as React from "react";
import * as $ from "jquery";
import { IStudent } from "../../shared/IStudent";
import { Constants } from "../../shared/Constants";
import { List, ListColumnDefinition } from "../../shared/Components/List";
import { PageAlertEntry } from "../../shared/Interfaces";
import { IGuardian } from "../../shared/IGuardian";
import { AssociateChild } from "./Associations/AssociateChild";
import { IRawStudent } from "../../shared/RawRestInterfaces";

import "../../../styles/MainShared.less";
import "../../../styles/AttendenceModifications.less";

class GuardianChildListContainer extends List<IStudent> { }

export interface GuardianAssociationProperties {
    guardianToEdit: IGuardian;
    authorizationToken: string;
    onEditTargetChanged(alteredGuardian: IGuardian): void;
}

export interface GuardianAssociationState {
    childList: IStudent[];
    pageAlerts: PageAlertEntry[];
}

export class GuardianAssociation extends React.Component<GuardianAssociationProperties, GuardianAssociationState> {
    constructor(props: GuardianAssociationProperties) {
        super(props);

        this.state = {
            pageAlerts: [],
            childList: null,
        };
    }

    public componentDidMount() {
        // trigger the rest request...
        fetch(Constants.BackendUri + "students", {
            headers: {
                "content-type": "application/json",
                "sm-authorization-header": this.props.authorizationToken || ""
            },
            method: "GET",
        }).then((response) => {
            response.json().then((rawStudentList: IRawStudent[]) => {
                const childList: IStudent[] = [];
                rawStudentList.forEach((rawStudent) => {
                    const mappedStudent = this.convertRawStudentToInternalStudent(rawStudent);
                    childList.push(mappedStudent);
                });
                this.setState({ childList });
            }).catch((err) => {
                this.setState({ childList: null });
            });
        }).catch((err) => {
            this.setState({ childList: null });
        });
    }

    public render(): JSX.Element {
        return <div className="attendence-modification-container">
            <h2>Associate Child to Guardian</h2>

            {this.renderAvailableStudentsInterface()}
            {this.renderGuardianDetails()}
            {this.renderAssociatedChildren()}

            {this.renderPageAlerts()}
        </div>;
    }

    private renderPageAlerts(): JSX.Element[] {
        const alertList: JSX.Element[] = [];
        this.state.pageAlerts.forEach((alert: PageAlertEntry, index) => {
            const alertClass = `alert ${alert.pageAlertType}`;
            alertList.push(<div className={alertClass} role="alert">
                {alert.pageAlert}
                <button type="button" onClick={() => {
                    this.setState((prevState: GuardianAssociationState) => {
                        const pageAlerts = Object.assign([], prevState.pageAlerts);
                        pageAlerts.splice(index, 1);
                        return { pageAlerts };
                    });
                }} className="close" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>);
        });
        return alertList;
    }

    private renderAvailableStudentsInterface(): JSX.Element {
        return <AssociateChild
            studentList={this.state.childList}
            authorizationToken={this.props.authorizationToken}
            guardianSelected={this.props.guardianToEdit}
            onEditTargetChanged={this.props.onEditTargetChanged} />;
    }

    private renderAssociatedChildren(): JSX.Element {
        return <div className="attendee-modify-classlist-container">
            <h3 className="classlist-header">My Children</h3>
            <span className="classlist-add-attendee">
                <button className="btn btn-info" onClick={() => {
                    const component: any = $("#guardian-association-modal");
                    component.modal("show");
                }}>Associate Child</button>
            </span>
            <GuardianChildListContainer
                data={this.props.guardianToEdit.studentList}
                columns={this.makeColumns()} />
        </div>;
    }

    private makeColumns(): ListColumnDefinition<IStudent>[] {
        const columns: ListColumnDefinition<IStudent>[] = [];

        columns.push({
            titleDisplayValue: "Id",
            renderer: (student: IStudent): JSX.Element => {
                return <div className="cx-padding-top">
                    {student.id}
                </div>;
            }
        });

        columns.push({
            titleDisplayValue: "Name",
            renderer: (student: IStudent): JSX.Element => {
                return <div className="cx-padding-top">{student.name}</div>;
            }
        });

        columns.push({
            titleDisplayValue: "Actions",
            renderer: (student: IStudent): JSX.Element => {
                return <div><button type="button" className="btn btn-info btn-sm" onClick={() => {
                    this.disassociateChildFromGuardian(this.props.guardianToEdit.id, student);
                }}>Remove</button></div>;
            }
        });

        return columns;
    }

    // private onCopyToClipboardClicked(student: IStudent) {
    //     const result = this.copyStudentIdToClipboard(student.id);
    //     if (result) {
    //         this.setState((prevState: GuardianAssociationState) => {
    //             const pageAlerts = Object.assign([], prevState.pageAlerts);
    //             pageAlerts.push({ pageAlert: "Copied to Clipboard Successfully!", pageAlertType: "alert-success" });
    //             return { pageAlerts };
    //         });
    //     } else {
    //         this.setState((prevState: GuardianAssociationState) => {
    //             const pageAlerts = Object.assign([], prevState.pageAlerts);
    //             pageAlerts.push({ pageAlert: "Copy to Clipboard Failed!", pageAlertType: "alert-danger" });
    //             return { pageAlerts };
    //         });
    //     }
    // }

    /**
     * Take an input string and place it into the copy buffer... support matrix
     * says we should work IE9+ and most other browsers...
     * @param inputText a string value we want to copy to the clipboard
     */
    // private copyStudentIdToClipboard(inputText: string): boolean {
    //     try {
    //         const copyBufferTempDomentry = document.createElement("textarea");
    //         copyBufferTempDomentry.value = inputText;
    //         document.body.appendChild(copyBufferTempDomentry);

    //         copyBufferTempDomentry.select();
    //         /* Copy the text inside the text field */
    //         document.execCommand("Copy");
    //         document.body.removeChild(copyBufferTempDomentry);
    //     } catch (err) {
    //         console.error(err);
    //         return false;
    //     }
    //     return true;
    // }

    private disassociateChildFromGuardian(classId: string, student: IStudent) {
        fetch(Constants.BackendUri + `assign?Id=${classId}&StudentId=${student.id}`, {
            headers: {
                "content-type": "application/json",
                "sm-authorization-header": this.props.authorizationToken || ""
            },
            method: "DELETE",
        }).then((response) => {
            // remove list
            this.setState((prevState: GuardianAssociationState) => {
                const guardianItem: IGuardian = Object.assign({}, this.props.guardianToEdit);
                const studentIndex = guardianItem.studentList.indexOf(student);

                // TODO: violates the immutability requirements of react (modifies the array of students in place)
                guardianItem.studentList.splice(studentIndex, 1);
                return {};
            });
        }).catch((err) => {
            // show error message
            this.setState((prevState: GuardianAssociationState) => {
                const pageAlerts = Object.assign([], prevState.pageAlerts);
                pageAlerts.push({ pageAlert: err.message, pageAlertType: "alert-danger" });

                return { pageAlerts };
            });
        });
    }

    private renderGuardianDetails(): JSX.Element {
        return <table className="table class-details-table">
            <thead className="class-details-header-def">
                <tr className="class-details-header-row-def">
                    <th scope="col" className="class-details-header-row-col-def first-row"></th>
                    <th scope="col" className="class-details-header-row-col-def"></th>
                </tr>
            </thead>
            <tr className="class-details-row">
                <td className="class-details-col">Name</td>
                <td className="class-details-col">{this.props.guardianToEdit.name}</td>
            </tr>
            <tr className="class-details-row">
                <td className="class-details-col">Email</td>
                <td className="class-details-col">{this.props.guardianToEdit.email}</td>
            </tr>
        </table>;
    }

    // TODO: remove the student list work from this class, share it with student list
    private convertRawStudentToInternalStudent(rawStudent: IRawStudent): IStudent {
        return {
            id: rawStudent._id,
            name: rawStudent._name,
            grade: rawStudent._grade
        };
    }
}