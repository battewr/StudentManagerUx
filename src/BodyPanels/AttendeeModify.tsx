import * as React from "react";
import * as $ from "jquery";
import { IClass } from "../shared/IClass";
import { IStudent } from "../shared/IStudent";
import { Constants } from "../shared/Constants";
import { RegisterStudent } from "./RegisterStudent";

import "../../styles/AttendenceModifications.less";

interface PageAlertEntry {
    pageAlert: string;
    pageAlertType: string;
}

export interface AttendeeModifyProperties {
    classToEdit: IClass;
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
            onEditTargetChanged={this.props.onEditTargetChanged} />;
    }

    private renderClassList(): JSX.Element {
        const studentList: IStudent[] = this.props.classToEdit.studentList;

        const studentRenderedList: JSX.Element[] = [];
        studentList.forEach((student, index) => {
            const studentItem = <tr>
                <th scope="row">{index}</th>
                <td>
                    <span className="student-id">{student.id}</span>
                    <img className="student-id-clipboard-copy-img" src="./img/copy.svg" onClick={() => {
                        this.onCopyToClipboardClicked(student);
                    }} />
                </td>
                <td>{student.name}</td>
                <td>
                    <a href="#" onClick={() => {
                        this.removeStudentFromClass(this.props.classToEdit.id, student);
                    }}>Remove</a>
                </td>
            </tr>;
            studentRenderedList.push(studentItem);
        });

        return <div className="attendee-modify-classlist-container">
            <h3 className="classlist-header">Attendee List</h3>
            <span className="classlist-add-attendee">
                <button className="btn btn-primary" onClick={() => {
                    const component: any = $("#register-student-modal");
                    component.modal("show");
                }}>
                    +
                </button>
            </span>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">ID</th>
                        <th scope="col">Name</th>
                        <th scope="col">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {studentRenderedList}
                </tbody>
            </table></div>;
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
                "content-type": "application/json"
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