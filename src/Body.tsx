import * as React from "React";
import { Constants } from "./shared/Constants";
import { CreateStudent } from "./CreateStudent";
import { StudentList } from "./StudentList";

import "../styles/Body.less";
import "../styles/Shared.less";

export interface BodyProperties {

}

export interface BodyState {

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
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="body-container">
            <CreateStudent />
            {/* TODO: Create menu; load the create or student list accordingly */}
            {/* <StudentList /> */}
        </div>;
    }
};