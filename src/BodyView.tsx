import * as React from "React";
import { observer } from "mobx-react";

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

import { IBodyViewModel } from "./ViewModels/Base/BodyViewModel";

import "../styles/Body.less";
import "../styles/MainShared.less";

export interface BodyProperties {
  context: IBodyViewModel;
}

/**
 *
 */
@observer
export class BodyView extends React.Component<BodyProperties> {
  /**
   *
   * @param props
   */
  constructor(props: any) {
    super(props);

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
    const applicationModel = this.props.context._applicationModel;
    if (applicationModel.loading) {
      return <div className="body-container">Loading</div>;
    }
    return (
      <div className="body-container">{this.renderSelectedMenuOption()}</div>
    );
  }

  /**
   *
   */
  private renderSelectedMenuOption(): JSX.Element {
    const layoutModel = this.props.context._layoutModel;
    const applicationModel = this.props.context._applicationModel;
    switch (layoutModel.selectedPanel) {
      case SelectedPanel.StudentRegistration:
        return <StudentRegister authorizationToken={applicationModel.authorizationToken} />;
      case SelectedPanel.StudentList:
        return <StudentList onEditStudent={this.onEditStudent} authorizationToken={applicationModel.authorizationToken} />;
      case SelectedPanel.StudentModification:
        return <StudentModify studentToEdit={layoutModel.editTarget as IStudent} authorizationToken={applicationModel.authorizationToken} />;
      case SelectedPanel.ClassRegistration:
        return <ClassRegister authorizationToken={applicationModel.authorizationToken} />;
      case SelectedPanel.ClassList:
        return (
          <ClassList
            onEditClass={this.onEditClass}
            onEditClassList={this.onEditClassList}
            authorizationToken={applicationModel.authorizationToken}
          />
        );
      case SelectedPanel.ClassModification:
        return <ClassModify classToEdit={layoutModel.editTarget as IClass} authorizationToken={applicationModel.authorizationToken} />;
      case SelectedPanel.AttendenceModification:
        return (
          <AttendeeModify
            classToEdit={layoutModel.editTarget as IClass}
            onEditTargetChanged={this.onEditTargetChanged}
            authorizationToken={applicationModel.authorizationToken}
          />
        );
      case SelectedPanel.GuardianList:
        return (
          <GuardianList
            onEditGuardian={this.onEditGuardian}
            onEditAssociatedChildren={this.onEditAssociatedChildren}
            authorizationToken={applicationModel.authorizationToken}
          />
        );
      case SelectedPanel.GuardianRegistration:
        return <GuardianRegister authorizationToken={applicationModel.authorizationToken} />;
      case SelectedPanel.GuardianModification:
        return <GuardianModify guardianToEdit={layoutModel.editTarget as IGuardian} authorizationToken={applicationModel.authorizationToken} />;
      case SelectedPanel.GuardianAssociation:
        return <GuardianAssociation
          guardianToEdit={layoutModel.editTarget as IGuardian}
          onEditTargetChanged={this.onGuardianitTargetChanged}
          authorizationToken={applicationModel.authorizationToken} />;
      default:
        throw "Unsupported Menu Option!!";
    }
  }

  private onEditTargetChanged(newClass: IClass): void {
    // bbax: TODO: effectively this will always be classToEdit === newClass because
    // this is triggered when someone pressed + button on register student, copied via
    // attendece modification, back here, so we can trigger a re-render
    this.props.context.setEditTarget(newClass);
  }

  private onGuardianitTargetChanged(newGuardian: IGuardian): void {
    // bbax: TODO: effectively this will always be classToEdit === newClass because
    // this is triggered when someone pressed + button on register student, copied via
    // attendece modification, back here, so we can trigger a re-render
    this.props.context.setEditTarget(newGuardian);
  }

  private onEditStudent(studentId: IStudent) {
    this.props.context.setEditTarget(studentId, SelectedPanel.StudentModification);

  }

  private onEditClass(classToEdit: IClass) {
    this.props.context.setEditTarget(classToEdit, SelectedPanel.ClassModification);
  }

  private onEditGuardian(newGuardianTarget: IGuardian): void {
    this.props.context.setEditTarget(newGuardianTarget, SelectedPanel.GuardianModification);
  }

  private onEditClassList(classToEdit: IClass) {
    this.props.context.setEditTarget(classToEdit, SelectedPanel.AttendenceModification);
  }

  private onEditAssociatedChildren(guardianToEdit: IGuardian) {
    this.props.context.setEditTarget(guardianToEdit, SelectedPanel.GuardianAssociation);
  }
}
