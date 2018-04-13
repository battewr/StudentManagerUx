import * as React from "React";

import { Constants } from "./shared/Constants";
import { SelectedPanel } from "./shared/Enums";
import { IStudent } from "./shared/IStudent";
import { IClass } from "./shared/IClass";
import { IGuardian } from "./shared/IGuardian";

import { StudentRegister } from "./BodyPanels/Student/StudentRegister";
import { StudentList } from "./BodyPanels/Student/StudentList";
import { StudentModify } from "./BodyPanels/Student/StudentModify";
import { ClassList } from "./BodyPanels/Class/ClassList";
import { ClassModify } from "./BodyPanels/Class/ClassModify";
import { ClassRegister } from "./BodyPanels/Class/ClassRegister";
import { AttendeeModify } from "./BodyPanels/SubLists/AttendeeModify";
import { GuardianList } from "./BodyPanels/Guardian/GuardianList";
import { GuardianRegister } from "./BodyPanels/Guardian/GuardianRegister";
import { GuardianModify } from "./BodyPanels/Guardian/GuardianModify";
import { GuardianAssociation } from "./BodyPanels/SubLists/GuardianAssociation";

import "../styles/Body.less";
import "../styles/MainShared.less";

export interface BodyProperties {
  selectedPanel: SelectedPanel;
  onPanelChange(selectedPanel: SelectedPanel): void;
}

export interface BodyState {
  studentToEdit: IStudent;
  classToEdit: IClass;
  guardianToEdit: IGuardian;
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
      classToEdit: null,
      guardianToEdit: null
    };

    this.onEditStudent = this.onEditStudent.bind(this);
    this.onEditClass = this.onEditClass.bind(this);
    this.onEditClassList = this.onEditClassList.bind(this);
    this.onEditTargetChanged = this.onEditTargetChanged.bind(this);

    this.onEditGuardian = this.onEditGuardian.bind(this);
    this.onEditAssociatedChildren = this.onEditAssociatedChildren.bind(this);
    this.onGuardianitTargetChanged = this.onGuardianitTargetChanged.bind(this);
  }

  /**
   *
   * @returns {JSX.Element}
   */
  public render(): JSX.Element {
    return (
      <div className="body-container">{this.renderSelectedMenuOption()}</div>
    );
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
        return (
          <ClassList
            onEditClass={this.onEditClass}
            onEditClassList={this.onEditClassList}
          />
        );
      case SelectedPanel.ClassModification:
        return <ClassModify classToEdit={this.state.classToEdit} />;
      case SelectedPanel.AttendenceModification:
        return (
          <AttendeeModify
            classToEdit={this.state.classToEdit}
            onEditTargetChanged={this.onEditTargetChanged}
          />
        );
      case SelectedPanel.GuardianList:
        return (
          <GuardianList
            onEditGuardian={this.onEditGuardian}
            onEditAssociatedChildren={this.onEditAssociatedChildren}
          />
        );
      case SelectedPanel.GuardianRegistration:
        return <GuardianRegister />;
      case SelectedPanel.GuardianModification:
        return <GuardianModify guardianToEdit={this.state.guardianToEdit} />;
      case SelectedPanel.GuardianAssociation:
        return <GuardianAssociation
          guardianToEdit={this.state.guardianToEdit}
          onEditTargetChanged={this.onGuardianitTargetChanged} />;
      default:
        throw "Unsupported Menu Option!!";
    }
  }

  private onEditTargetChanged(newClass: IClass): void {
    // bbax: TODO: effectively this will always be classToEdit === newClass because
    // this is triggered when someone pressed + button on register student, copied via
    // attendece modification, back here, so we can trigger a re-render
    this.setState({ classToEdit: newClass });
  }

  private onGuardianitTargetChanged(newGuardian: IGuardian): void {
    // bbax: TODO: effectively this will always be classToEdit === newClass because
    // this is triggered when someone pressed + button on register student, copied via
    // attendece modification, back here, so we can trigger a re-render
    this.setState({ guardianToEdit: newGuardian });
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

  private onEditGuardian(newGuardianTarget: IGuardian): void {
    this.setState({ guardianToEdit: newGuardianTarget }, () => {
      this.props.onPanelChange(SelectedPanel.GuardianModification);
    });
  }

  private onEditClassList(classToEdit: IClass) {
    this.setState({ classToEdit }, () => {
      this.props.onPanelChange(SelectedPanel.AttendenceModification);
    });
  }

  private onEditAssociatedChildren(guardianToEdit: IGuardian) {
    this.setState({ guardianToEdit }, () => {
      this.props.onPanelChange(SelectedPanel.GuardianAssociation);
    });
  }
}
