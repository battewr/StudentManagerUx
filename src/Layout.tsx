import * as React from "React";

import { Body } from "./Body";

import "../styles/Layout.less";

export interface LayoutProperties {

}

export class Layout extends React.Component<LayoutProperties> {
    constructor(props: any) {
        super(props);
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="main-app-root">
            <div className="title-section">
                <h1>Student Management Application</h1>
            </div>
            <div className="main-body-section">
                <Body />
            </div>
            <div className="footer-section">Footer</div>
        </div>;
    }
};