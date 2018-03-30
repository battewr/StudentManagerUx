import * as React from "React";

import { Title } from "./Title";
import { Body } from "./Body";
import { RightMenuPanel } from "./RightMenuPanel";

import "../styles/Layout.less";
import { isPrimitive } from "util";

export interface LayoutProperties {

}

export interface LayoutState {
    mainMenuVisible: boolean;
}

export class Layout extends React.Component<LayoutProperties, LayoutState> {
    /**
     *
     * @param props
     */
    constructor(props: any) {
        super(props);

        this.state = {
            mainMenuVisible: false
        };

        this.onToggleMainMenu = this.onToggleMainMenu.bind(this);
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="main-app-root">
            <div className="title-section">
                <Title onToggleMenu={this.onToggleMainMenu} />
            </div>
            <div className="main-body-section">
                <RightMenuPanel isPanelVisible={this.state.mainMenuVisible} />
                <Body />
            </div>
            <div className="footer-section">
                {/* TODO */}
                &nbsp;
            </div>
        </div>;
    }

    /**
     *
     */
    private onToggleMainMenu() {
        this.setState({mainMenuVisible: !this.state.mainMenuVisible});
    }
};