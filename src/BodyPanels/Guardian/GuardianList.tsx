import * as React from "React";
import { randomBytes } from "crypto";

import { Constants } from "../../shared/Constants";
import { IGuardian } from "../../shared/IGuardian";
import { IRawGuardian, IRawStudent } from "../../shared/RawRestInterfaces";
import { IStudent } from "../../shared/IStudent";
import { List, ListColumnDefinition } from "../../shared/Components/List";

import "../../../styles/MainShared.less";

class GuardianListContainer extends List<IGuardian> { }

export interface GuardianListProperties {
    onEditGuardian(guardianToEdit: IGuardian): void;
    onEditAssociatedChildren(guardianToEdit: IGuardian): void;
}

export interface GuardianListState {
    isLoading: boolean;
    error: string;
    guardianList: IGuardian[];
}

/**
 *
 */
export class GuardianList extends React.Component<GuardianListProperties, GuardianListState> {
    /**
     *
     * @param props
     */
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            error: null,
            guardianList: null
        };

        this.makeColumns = this.makeColumns.bind(this);
    }

    public componentDidMount() {
        // trigger the rest request...
        fetch(Constants.BackendUri + "guardian", {
            headers: {
                "content-type": "application/json"
            },
            method: "GET",
        }).then((response) => {
            response.json().then((rawClassList: IRawGuardian[]) => {
                const guardianList: IGuardian[] = [];
                rawClassList.forEach((rawGuardianItem) => {
                    guardianList.push(this.convertRawGuardianToInternalClass(rawGuardianItem));
                });
                this.setState({ isLoading: false, error: null, guardianList });
            }).catch((err) => {
                this.setState({ isLoading: false, error: err.message, guardianList: null });
            });
        }).catch((err) => {
            this.setState({ isLoading: false, error: err, guardianList: null });
        });
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="class-list-container">
            <h2>Guardian List</h2>
            {this.renderClassList()}
        </div>;
    }

    private renderClassList(): JSX.Element {
        return <GuardianListContainer
            columns={this.makeColumns()}
            data={this.state.guardianList} />;
    }

    private makeColumns(): ListColumnDefinition<IGuardian>[] {
        const columns: ListColumnDefinition<IGuardian>[] = [];
        columns.push({
            titleDisplayValue: "Name",
            renderer: (guardianItem: IGuardian): JSX.Element => {
                return <div className="cx-padding-top">{guardianItem.name}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Email",
            renderer: (guardianItem: IGuardian): JSX.Element => {
                return <div className="cx-padding-top">{guardianItem.email}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Actions",
            renderer: (guardianItem: IGuardian): JSX.Element => {
                return <div>
                    <button type="button" className="btn btn-info btn-sm" onClick={() => {
                        this.props.onEditGuardian(guardianItem);
                    }}>Edit</button>&nbsp;
                    <button type="button" className="btn btn-info btn-sm" onClick={() => {
                        this.props.onEditAssociatedChildren(guardianItem);
                    }}>Child List</button>
                </div>;
            }
        });
        return columns;
    }

    private convertRawStudentToInternalStudent(rawStudent: IRawStudent): IStudent {
        return {
            id: rawStudent._id,
            name: rawStudent._name,
            grade: rawStudent._grade
        };
    }

    private convertRawGuardianToInternalClass(rawGuardian: IRawGuardian): IGuardian {

        const studentList: IStudent[] = [];
        rawGuardian._studentList.forEach((rawStudent) => {
            studentList.push(this.convertRawStudentToInternalStudent(rawStudent));
        });

        return {
            id: rawGuardian._id,
            name: rawGuardian._name,
            email: rawGuardian._email,
            studentList
        };
    }
};