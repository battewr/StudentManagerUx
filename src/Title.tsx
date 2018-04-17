import * as React from "React";
import { LoginModal } from "./BodyPanels/LoginModal";

import "../styles/MainShared.less";
import "../styles/Title.less";
import { RegisterAccountModal } from "./BodyPanels/RegisterAccountModal";
import { ENGINE_METHOD_DH } from "constants";

export interface TitleProperties {
  showLogin: boolean;
  authorizationToken: string;

  onToggleMenu(): void;
  onLoginSuccessful(token: string, expiresAt: string): void;
  onLogout(): void;
}

export class Title extends React.Component<TitleProperties> {
  constructor(props: any) {
    super(props);

    this.tryLogin = this.tryLogin.bind(this);
    this.onLoginSuccessful = this.onLoginSuccessful.bind(this);
    this.onRegisterRequested = this.onRegisterRequested.bind(this);
    this.onRegistered = this.onRegistered.bind(this);
  }

  public componentWillReceiveProps(props: TitleProperties) {
    if (props.showLogin) {
      this.tryLogin();
    }
  }

  /**
   *
   * @returns {JSX.Element}
   */
  public render(): JSX.Element {
    return (
      <div className="title-container">
        <span className="title-section-menu-icon" onClick={this.props.onToggleMenu}>
          <img className="title-section-menu-icon-img" src="./img/menu-icon.svg" />
        </span>
        <span className="title-section-app-title unselectable">
          Student Management Application
        </span>
        <span className="title-section-login-icon" onClick={this.tryLogin}>
          <img className="title-section-menu-icon-img" src="./img/login.svg" />
        </span>

        <RegisterAccountModal onRegisteredSuccessfully={this.onRegistered} />
        <LoginModal onLoginSuccessful={this.onLoginSuccessful} onRegisterRequested={this.onRegisterRequested} />

      </div>
    );
  }

  private onRegistered(): void {
    this.setVisibleRegister("hide");
    this.setVisibleLogin("show");
  }

  private onRegisterRequested(): void {
    this.setVisibleLogin("hide");
    this.setVisibleRegister("show");
  }

  private onLoginSuccessful(token: string, expiresAt: string) {
    this.setVisibleLogin("hide");

    console.log("Login successful, closing modal");
    this.props.onLoginSuccessful(token, expiresAt);
  }

  private tryLogin() {
    if (this.props.authorizationToken && this.props.authorizationToken.length > 0) {
      this.props.onLogout();
      return;
    }
    this.setVisibleLogin("show");
  }

  private setVisibleLogin(visible: string) {
    const component: any = $("#login-modal");
    component.modal(visible);
  }

  private setVisibleRegister(visible: string) {
    const component: any = $("#register-modal");
    component.modal(visible);
  }
}
