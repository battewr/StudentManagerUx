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
    authorizationToken: string;
};

export class Layout extends React.Component<LayoutProperties, LayoutState> {
    /**
     *
     * @param props
     */
    constructor(props: any) {
        super(props);

        this.state = {
            mainMenuVisible: true,
            selectedPanel: SelectedPanel.StudentList,
            authorizationToken: null,
        };

        this.onToggleMainMenu = this.onToggleMainMenu.bind(this);
        this.onPanelChanged = this.onPanelChanged.bind(this);
        this.onLoginSuccessful = this.onLoginSuccessful.bind(this);
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="main-app-root">
            <div className="title-section">
                <Title onToggleMenu={this.onToggleMainMenu} onLoginSuccessful={this.onLoginSuccessful} />
            </div>
            <div className="main-body-section">
                <RightMenuPanel
                    selectedMenuItem={this.state.selectedPanel}
                    isPanelVisible={this.state.mainMenuVisible}
                    onPanelSelectChanged={this.onPanelChanged} />

                <Body
                    selectedPanel={this.state.selectedPanel}
                    onPanelChange={this.onPanelChanged}
                    authorizationToken={this.state.authorizationToken} />
            </div>
            <div className="footer-section">
                {/* TODO */}
                &nbsp;
            </div>
        </div>;
    }

    private onLoginSuccessful(token: string, expiresAt: string): void {
        this.setState({ authorizationToken: token });
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