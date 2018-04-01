import * as React from "React";
import { Constants } from "./shared/Constants";
import { StudentRegister } from "./BodyPanels/StudentRegister";
import { StudentList } from "./BodyPanels/StudentList";
import { SelectedPanel } from "./shared/Enums";
import { StudentModify } from "./BodyPanels/StudentModify";
import { IStudent } from "./shared/IStudent";
import { ClassList } from "./BodyPanels/ClassList";
import { IClass } from "./shared/IClass";
import { ClassModify } from "./BodyPanels/ClassModify";
import { ClassRegister } from "./BodyPanels/ClassRegister";

import "../styles/Body.less";
import "../styles/Shared.less";
import { AttendenceModification } from "./BodyPanels/AttendenceModification";

export interface BodyProperties {
    selectedPanel: SelectedPanel;
    onPanelChange(selectedPanel: SelectedPanel): void;
}

export interface BodyState {
    studentToEdit: IStudent;
    classToEdit: IClass;
}

/**
 *
 */
export class Body extends React.Component<BodyProperties, BodyState> {
    /**
     *
     * @param props
     */
    constructor(props: any) {
        super(props);

        this.state = {
            studentToEdit: null,
            classToEdit: null
        };

        this.onEditStudent = this.onEditStudent.bind(this);
        this.onEditClass = this.onEditClass.bind(this);
        this.onEditClassList = this.onEditClassList.bind(this);
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="body-container">
            {this.renderSelectedMenuOption()}
        </div>;
    }

    /**
     *
     */
    private renderSelectedMenuOption(): JSX.Element {
        switch (this.props.selectedPanel) {
            case SelectedPanel.StudentRegistration:
                return <StudentRegister />;
            case SelectedPanel.StudentList:
                return <StudentList onEditStudent={this.onEditStudent} />;
            case SelectedPanel.StudentModification:
                return <StudentModify studentToEdit={this.state.studentToEdit} />;
            case SelectedPanel.ClassRegistration:
                return <ClassRegister />;
            case SelectedPanel.ClassList:
                return <ClassList onEditClass={this.onEditClass} onEditClassList={this.onEditClassList} />;
            case SelectedPanel.ClassModification:
                return <ClassModify classToEdit={this.state.classToEdit} />;
            case SelectedPanel.AttendenceModification:
                return <AttendenceModification classToEdit={this.state.classToEdit} />;
            default:
                throw "Unsupported Menu Option!!";

        }
    }

    private onEditStudent(studentId: IStudent) {
        this.setState({ studentToEdit: studentId }, () => {
            this.props.onPanelChange(SelectedPanel.StudentModification);
        });
    }

    private onEditClass(classToEdit: IClass) {
        this.setState({ classToEdit }, () => {
            this.props.onPanelChange(SelectedPanel.ClassModification);
        });
    }

    private onEditClassList(classToEdit: IClass) {
        this.setState({ classToEdit }, () => {
            this.props.onPanelChange(SelectedPanel.AttendenceModification);
        });
    }
};