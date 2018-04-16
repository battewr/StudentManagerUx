import * as React from "react";
import * as $ from "jquery";
import { IClass } from "../../shared/IClass";
import { IStudent } from "../../shared/IStudent";
import { Constants } from "../../shared/Constants";
import { RegisterStudent } from "./Associations/RegisterStudent";
import { List, ListColumnDefinition } from "../../shared/Components/List";
import { PageAlertEntry } from "../../shared/Interfaces";

import "../../../styles/MainShared.less";
import "../../../styles/AttendenceModifications.less";

class AttendeeModifyListContainer extends List<IStudent> { }

export interface AttendeeModifyProperties {
    classToEdit: IClass;
    authorizationToken: string;
    onEditTargetChanged(alteredClass: IClass): void;
}

export interface AttendeeModifyState {
    pageAlerts: PageAlertEntry[];
}

export class AttendeeModify extends React.Component<AttendeeModifyProperties, AttendeeModifyState> {
    constructor(props: AttendeeModifyProperties) {
        super(props);

        this.state = {
            pageAlerts: [],
        };
    }

    public render(): JSX.Element {
        return <div className="attendence-modification-container">
            <h2>Modify Class Attendees</h2>

            {this.renderAvailableStudentsInterface()}
            {this.renderClassContainerDetails()}
            {this.renderClassList()}

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
                    this.setState((prevState: AttendeeModifyState) => {
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
        return <RegisterStudent
            classSelected={this.props.classToEdit}
            onEditTargetChanged={this.props.onEditTargetChanged}
            authorizationToken={this.props.authorizationToken} />;
    }

    private renderClassList(): JSX.Element {
        return <div className="attendee-modify-classlist-container">
            <h3 className="classlist-header">Attendee List</h3>
            <span className="classlist-add-attendee">
                <button className="btn btn-info" onClick={() => {
                    const component: any = $("#register-student-modal");
                    component.modal("show");
                }}>Add Student</button>
            </span>
            <AttendeeModifyListContainer
                data={this.props.classToEdit.studentList}
                columns={this.makeColumns()} />
        </div>;
    }

    private makeColumns(): ListColumnDefinition<IStudent>[] {
        const columns: ListColumnDefinition<IStudent>[] = [];

        columns.push({
            titleDisplayValue: "Id",
            renderer: (student: IStudent): JSX.Element => {
                return <div className="cx-padding-top">
                    <span onClick={() => {
                        this.onCopyToClipboardClicked(student);
                    }}>
                        <img className="student-id-clipboard-copy-img" src="./img/copy.svg" />
                    </span>
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
                    this.removeStudentFromClass(this.props.classToEdit.id, student);
                }}>Remove</button></div>;
            }
        });

        return columns;
    }

    private onCopyToClipboardClicked(student: IStudent) {
        const result = this.copyStudentIdToClipboard(student.id);
        if (result) {
            this.setState((prevState: AttendeeModifyState) => {
                const pageAlerts = Object.assign([], prevState.pageAlerts);
                pageAlerts.push({ pageAlert: "Copied to Clipboard Successfully!", pageAlertType: "alert-success" });
                return { pageAlerts };
            });
        } else {
            this.setState((prevState: AttendeeModifyState) => {
                const pageAlerts = Object.assign([], prevState.pageAlerts);
                pageAlerts.push({ pageAlert: "Copy to Clipboard Failed!", pageAlertType: "alert-danger" });
                return { pageAlerts };
            });
        }
    }

    /**
     * Take an input string and place it into the copy buffer... support matrix
     * says we should work IE9+ and most other browsers...
     * @param inputText a string value we want to copy to the clipboard
     */
    private copyStudentIdToClipboard(inputText: string): boolean {
        try {
            const copyBufferTempDomentry = document.createElement("textarea");
            copyBufferTempDomentry.value = inputText;
            document.body.appendChild(copyBufferTempDomentry);

            copyBufferTempDomentry.select();
            /* Copy the text inside the text field */
            document.execCommand("Copy");
            document.body.removeChild(copyBufferTempDomentry);
        } catch (err) {
            console.error(err);
            return false;
        }
        return true;
    }

    private removeStudentFromClass(classId: string, student: IStudent) {
        fetch(Constants.BackendUri + `attendence?Id=${classId}&StudentId=${student.id}`, {
            headers: {
                "content-type": "application/json",
                "sm-authorization-header": this.props.authorizationToken || ""
            },
            method: "DELETE",
        }).then((response) => {
            // remove list
            this.setState((prevState: AttendeeModifyState) => {
                const classItem: IClass = Object.assign({}, this.props.classToEdit);
                const studentIndex = classItem.studentList.indexOf(student);

                // TODO: violates the immutability requirements of react (modifies the array of students in place)
                classItem.studentList.splice(studentIndex, 1);
                return {};
            });
        }).catch((err) => {
            // show error message
            this.setState((prevState: AttendeeModifyState) => {
                const pageAlerts = Object.assign([], prevState.pageAlerts);
                pageAlerts.push({ pageAlert: err.message, pageAlertType: "alert-danger" });

                return { pageAlerts };
            });
        });
    }

    private renderClassContainerDetails(): JSX.Element {
        return <table className="table class-details-table">
            <thead className="class-details-header-def">
                <tr className="class-details-header-row-def">
                    <th scope="col" className="class-details-header-row-col-def first-row"></th>
                    <th scope="col" className="class-details-header-row-col-def"></th>
                </tr>
            </thead>
            <tr className="class-details-row">
                <td className="class-details-col">Name</td>
                <td className="class-details-col">{this.props.classToEdit.name}</td>
            </tr>
            <tr className="class-details-row">
                <td className="class-details-col">Year</td>
                <td className="class-details-col">{this.props.classToEdit.year}</td>
            </tr>
            <tr className="class-details-row">
                <td className="class-details-col">Semester</td>
                <td className="class-details-col">{this.props.classToEdit.semester}</td>
            </tr>
        </table>;
    }
}