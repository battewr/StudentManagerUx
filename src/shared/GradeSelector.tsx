import * as React from "React";

interface GradeSelectionWrapper {
    value: string;
    displayString: string;
}


const availableGrades: GradeSelectionWrapper[] = [
    { value: "K", displayString: "Kindergarden" },
    { value: "1", displayString: "Grade 1" },
    { value: "2", displayString: "Grade 2" },
    { value: "3", displayString: "Grade 3" },
    { value: "4", displayString: "Grade 4" },
    { value: "5", displayString: "Grade 5" },
    { value: "6", displayString: "Grade 6" },
    { value: "7", displayString: "Grade 7" },
    { value: "8", displayString: "Grade 8" },
    { value: "9", displayString: "Grade 9" },
    { value: "10", displayString: "Grade 10" },
    { value: "11", displayString: "Grade 11" },
    { value: "12", displayString: "Grade 12" }
];

export interface GradeSelectorProperties {
    studentGrade: string;

    onStudentGradeChanged(studentGrade: string): void;
}

export class GradeSelector extends React.Component<GradeSelectorProperties> {
    constructor(props: GradeSelectorProperties) {
        super(props);
    }

    public render() {
        /** TODO: make the backend given us information regarding which grades are possible */
        return (
            <select value={this.props.studentGrade } onChange={ this.onStudentGradeInputChanged.bind(this) }>
                { this.getOptionList() }
            </select >);
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onStudentGradeInputChanged(event: any): void {
        if (!event || !event.target || !event.target.value ||
            typeof event.target.value !== "string") {
            throw "Input type unexpected!";
        }
        this.props.onStudentGradeChanged(event.target.value);
    }

    /**
     *
     * @returns {JSX.Element[]}
     */
    private getOptionList(): JSX.Element[] {
        const returnList: JSX.Element[] = [];

        availableGrades.forEach((grade) => {
            returnList.push(
                <option selected={this.props.studentGrade === grade.value} value={grade.value}>
                    {grade.displayString}
                </option>);
        });

        return returnList;
    }
}