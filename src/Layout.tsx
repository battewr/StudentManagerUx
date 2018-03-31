import * as React from "React";

import { Title } from "./Title";
import { Body } from "./Body";
import { RightMenuPanel } from "./RightMenuPanel";
import { SelectedPanel } from "./shared/Enums";

import "../styles/Layout.less";

export interface LayoutProperties {

};

export interface LayoutState {
    mainMenuVisible: boolean;
    selectedPanel: SelectedPanel;
};

export class Layout extends React.Component<LayoutProperties, LayoutState> {
    /**
     *
     * @param props
     */
    constructor(props: any) {
        super(props);

        this.state = {
            mainMenuVisible: false,
            selectedPanel: SelectedPanel.ListStudents,
        };

        this.onToggleMainMenu = this.onToggleMainMenu.bind(this);
        this.onPanelChanged = this.onPanelChanged.bind(this);
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
                <RightMenuPanel
                    selectedMenuItem={this.state.selectedPanel}
                    isPanelVisible={this.state.mainMenuVisible}
                    onPanelSelectChanged={this.onPanelChanged} />

                <Body
                    selectedPanel={this.state.selectedPanel}
                    onPanelChange={this.onPanelChanged} />
            </div>
            <div className="footer-section">
                {/* TODO */}
                &nbsp;
            </div>
        </div>;
    }

    private onPanelChanged(selectedPanel: SelectedPanel): void {
        this.setState({ selectedPanel });
    }

    /**
     *
     */
    private onToggleMainMenu() {
        this.setState({ mainMenuVisible: !this.state.mainMenuVisible });
    }
};