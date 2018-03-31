import * as React from "React";
import { Constants } from "./shared/Constants";
import { CreateStudent } from "./CreateStudent";
import { StudentList } from "./StudentList";
import { SelectedPanel } from "./shared/Enums";
import { EditStudent } from "./EditStudent";
import { IStudent } from "./shared/IStudent";

import "../styles/Body.less";
import "../styles/Shared.less";

export interface BodyProperties {
    selectedPanel: SelectedPanel;
    onPanelChange(selectedPanel: SelectedPanel): void;
}

export interface BodyState {
    studentToEdit: IStudent;
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
            studentToEdit: null
        };

        this.onEditStudent = this.onEditStudent.bind(this);
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
            case SelectedPanel.CreateStudent:
                return <CreateStudent />;
            case SelectedPanel.ListStudents:
                return <StudentList onEditStudent={this.onEditStudent} />;
            case SelectedPanel.EditStudent:
                return <EditStudent studentToEdit={this.state.studentToEdit} />;
            default:
                throw "Unsupported Menu Option!!";

        }
    }

    private onEditStudent(studentId: IStudent) {
        this.setState({ studentToEdit: studentId }, () => {
            this.props.onPanelChange(SelectedPanel.EditStudent);
        });
    }
};