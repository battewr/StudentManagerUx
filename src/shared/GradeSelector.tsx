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
        let displaySelectedGrade = "";
        const index = availableGrades.findIndex((item) => { return item.value === this.props.studentGrade; });
        displaySelectedGrade = availableGrades[index].displayString || "Unknown";
        return <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle"
                type="button" id="dropdownMenuButton" data-toggle="dropdown"
                aria-haspopup="true" aria-expanded="false">
                {displaySelectedGrade}
            </button>
            <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                {this.getOptionList()}
            </div>
        </div>;
    }

    /**
     *
     * @param event
     * @returns {void}
     */
    private onStudentGradeInputChanged(grade: string): void {
        this.props.onStudentGradeChanged(grade);
    }

    /**
     *
     * @returns {JSX.Element[]}
     */
    private getOptionList(): JSX.Element[] {
        //                 {/* <a className="dropdown-item" href="#">Action</a>
        //   <a className="dropdown-item" href="#">Another action</a>
        //   <a className="dropdown-item" href="#">Something else here</a> */}
        const returnList: JSX.Element[] = [];

        availableGrades.forEach((grade) => {
            // returnList.push(
            //     <option selected={this.props.studentGrade === grade.value} value={grade.value}>
            //         {grade.displayString}
            //     </option>);
            returnList.push(<a className="dropdown-item"
                onClick={() => {
                    this.props.onStudentGradeChanged(grade.value);
                }} href="#">
                {grade.displayString}
            </a>);
        });

        return returnList;
    }
}