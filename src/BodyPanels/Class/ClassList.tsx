import * as React from "React";

import { Constants } from "../../shared/Constants";
import { IClass } from "../../shared/IClass";
import { IRawClass, IRawStudent } from "../../shared/RawRestInterfaces";
import { IStudent } from "../../shared/IStudent";
import { List, ListColumnDefinition } from "../../shared/Components/List";

import "../../../styles/MainShared.less";
class ClassListContainer extends List<IClass> { }

export interface ClassListProperties {
    onEditClass(classToEdit: IClass): void;
    onEditClassList(classToEdit: IClass): void;
    authorizationToken: string;
}

export interface ClassListState {
    isLoading: boolean;
    error: string;
    classList: IClass[];
}

/**
 *
 */
export class ClassList extends React.Component<ClassListProperties, ClassListState> {
    /**
     *
     * @param props
     */
    constructor(props: any) {
        super(props);

        this.state = {
            isLoading: true,
            error: null,
            classList: null
        };

        this.makeColumns = this.makeColumns.bind(this);
    }

    public componentDidMount() {
        // trigger the rest request...
        fetch(Constants.BackendUri + "class", {
            headers: {
                "content-type": "application/json",
                "sm-authorization-header": this.props.authorizationToken || ""
            },
            method: "GET",
        }).then((response) => {
            if (response.status !== 200) {
                return;
            }
            response.json().then((rawClassList: IRawClass[]) => {
                const classList: IClass[] = [];
                rawClassList.forEach((rawClassItem) => {
                    classList.push(this.convertRawClassToInternalClass(rawClassItem));
                });
                this.setState({ isLoading: false, error: null, classList });
            }).catch((err) => {
                this.setState({ isLoading: false, error: err.message, classList: null });
            });
        }).catch((err) => {
            this.setState({ isLoading: false, error: err, classList: null });
        });
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="class-list-container">
            <h2>Class Attendees</h2>
            {this.renderClassList()}
        </div>;
    }

    private renderClassList(): JSX.Element {
        return <ClassListContainer
            columns={this.makeColumns()}
            data={this.state.classList} />;
    }

    private makeColumns(): ListColumnDefinition<IClass>[] {
        const columns: ListColumnDefinition<IClass>[] = [];
        columns.push({
            titleDisplayValue: "Name",
            renderer: (classItem: IClass): JSX.Element => {
                return <div className="cx-padding-top">{classItem.name}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Semester",
            renderer: (classItem: IClass): JSX.Element => {
                return <div className="cx-padding-top">{classItem.semester}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Eligible For",
            renderer: (classItem: IClass): JSX.Element => {
                return <div className="cx-padding-top">{classItem.eligibleToGrade}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Year Offered",
            renderer: (classItem: IClass): JSX.Element => {
                return <div className="cx-padding-top">{classItem.year}</div>;
            }
        });
        columns.push({
            titleDisplayValue: "Actions",
            renderer: (classItem: IClass): JSX.Element => {
                return <div>
                    <button type="button" className="btn btn-info btn-sm" onClick={() => {
                        this.props.onEditClass(classItem);
                    }}>Edit</button>&nbsp;
                    <button type="button" className="btn btn-info btn-sm" onClick={() => {
                        this.props.onEditClassList(classItem);
                    }}>Attendee List</button>
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

    private convertRawClassToInternalClass(rawStudent: IRawClass): IClass {

        const studentList: IStudent[] = [];
        rawStudent._studentList.forEach((rawStudent) => {
            studentList.push(this.convertRawStudentToInternalStudent(rawStudent));
        });

        return {
            id: rawStudent._id,
            name: rawStudent._name,
            year: rawStudent._year,
            semester: rawStudent._semester,
            eligibleToGrade: rawStudent._eligibleToGrade,
            studentList
        };
    }
};