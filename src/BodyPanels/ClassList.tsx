import * as React from "React";
import { Constants } from "../shared/Constants";
import { IClass } from "../shared/IClass";
import Class from "./Class";

import "../../styles/Shared.less";

/**
 * This is the data as seen from the backend rest request before mapping the response into
 * the application types...
 * TODO: Gateway/Response Interpretor pattern...
 */
interface IRawClass {
    _name: string;
    _id: string;
    _semester: string;
    _year: string;
}

export interface ClassListProperties {
    onEditClass(classToEdit: IClass): void;
}

export interface ClassListState {
    isLoading: boolean;
    error: string;
    classList: IRawClass[];
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
            response.json().then((classList: IRawClass[]) => {
                this.setState({ isLoading: false, error: null, classList });
            }).catch((err) => {
                this.setState({ isLoading: false, error: err, classList: null });
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
            {this.renderStudentList()}
        </div>;
    }

    private renderStudentList(): JSX.Element[] {
        if (this.state.isLoading) {
            return [<div className="class-list-conent-loading">Loading...</div>];
        } else if (!!this.state.error) {
            return [<div className="class-list-content-load-failed">Error: {this.state.error}</div>];
        } else {
            if (!this.state.classList) {
                return [<div className="unknown-error">Unknown Exception</div>];
            }
            const studentListContent: JSX.Element[] = [];
            this.state.classList.forEach((student: IRawClass) => {
                const mappedStudent = this.convertRawStudentToInternalStudent(student);
                const studentDomEntry: JSX.Element = <div className="class-section">
                    <Class class={mappedStudent} onEditClass={this.props.onEditClass} />
                </div>;
                studentListContent.push(studentDomEntry);
            });

            return studentListContent;
        }
    }

    private convertRawStudentToInternalStudent(rawStudent: IRawClass): IClass {
        return {
            id: rawStudent._id,
            name: rawStudent._name,
            year: rawStudent._year,
            semester: rawStudent._semester,
        };
    }
};