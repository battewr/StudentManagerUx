import * as React from "React";
import { Constants } from "../shared/Constants";
import { IClass } from "../shared/IClass";
import Class from "./Class";
import { IRawClass, IRawStudent } from "../shared/RawRestInterfaces";
import { IStudent } from "../shared/IStudent";
import { randomBytes } from "crypto";

import "../../styles/Shared.less";

export interface ClassListProperties {
    onEditClass(classToEdit: IClass): void;
    onEditClassList(classToEdit: IClass): void;
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
    }

    public componentDidMount() {
        // trigger the rest request...
        fetch(Constants.BackendUri + "class", {
            headers: {
                "content-type": "application/json"
            },
            method: "GET",
        }).then((response) => {
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
        const classRenderedList: JSX.Element[] = [];

        if (this.state.classList) {
            this.state.classList.forEach((classItem, index) => {
                classRenderedList.push(
                    <Class class={classItem}
                        index={index}
                        onEditClass={this.props.onEditClass}
                        onEditClassList={this.props.onEditClassList} />);
            });
        }

        return <table className="table">
            <thead>
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Semester</th>
                    <th scope="col">Eligible For</th>
                    <th scope="col">Year Offered</th>
                    <th scope="col">Actions</th>
                </tr>
            </thead>
            <tbody>
                {classRenderedList}
            </tbody>
        </table>;
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