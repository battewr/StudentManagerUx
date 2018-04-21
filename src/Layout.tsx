import * as React from "React";

import { Title } from "./Title";
import { Body } from "./Body";
import { RightMenuPanel } from "./RightMenuPanel";

import { Constants } from "./shared/Constants";
import { SelectedPanel } from "./shared/Enums";
import { LocalStorageWrapper } from "./shared/LocalStorageWrapper";

import "../styles/Layout.less";

export interface LayoutProperties {

};

export interface LayoutState {
    mainMenuVisible: boolean;
    selectedPanel: SelectedPanel;
    authorizationToken: string;
    shouldRenderLogin: boolean;
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
            authorizationToken: LocalStorageWrapper.get().getItem(Constants.AuthorizationTokenKey),
            shouldRenderLogin: false,
        };

        this.onToggleMainMenu = this.onToggleMainMenu.bind(this);
        this.onPanelChanged = this.onPanelChanged.bind(this);
        this.onLoginSuccessful = this.onLoginSuccessful.bind(this);
        this.onSecurityContextRequired = this.onSecurityContextRequired.bind(this);
        this.onLogout = this.onLogout.bind(this);
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="main-app-root">
            <div className="title-section">
                <Title onToggleMenu={this.onToggleMainMenu}
                    showLogin={this.state.shouldRenderLogin}
                    onLoginSuccessful={this.onLoginSuccessful}
                    onLogout={this.onLogout}
                    authorizationToken={this.state.authorizationToken} />
            </div>
            <div className="main-body-section">
                <RightMenuPanel
                    selectedMenuItem={this.state.selectedPanel}
                    isPanelVisible={this.state.mainMenuVisible}
                    onPanelSelectChanged={this.onPanelChanged} />

                <Body
                    selectedPanel={this.state.selectedPanel}
                    onPanelChange={this.onPanelChanged}
                    onSecurityContextRequired={this.onSecurityContextRequired}
                    authorizationToken={this.state.authorizationToken} />
            </div>
            <div className="footer-section">
                {/* TODO */}
                &nbsp;
            </div>
        </div>;
    }

    private onSecurityContextRequired(): void {
        this.setState({ shouldRenderLogin: true });
    }

    private onLoginSuccessful(token: string, expiresAt: string): void {
        console.log("setting authorization token");
        this.setState({ authorizationToken: token, shouldRenderLogin: false });
    }

    private onLogout(): void {
        LocalStorageWrapper.get().removeItem(Constants.AuthorizationTokenKey);
        this.setState({ authorizationToken: null, shouldRenderLogin: true });
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