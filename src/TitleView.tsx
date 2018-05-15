import * as React from "React";
import { observer } from "mobx-react";

import { LoginModal } from "./LoginModal";

import { RegisterAccountModal } from "./RegisterAccountModal";
import { Login } from "./Model/Login";
import { TitleViewModel } from "./ViewModels/Base/TitleViewModel";
import { LoginModalViewModel } from "./ViewModels/Modal/LoginModalViewModel";
import { AuthorizationService } from "./Services/AuthorizationService";
import { RestGateway } from "./Gateways/RestGateway";

import { ModelFactory } from "./shared/ModelFactory";

import "../styles/MainShared.less";
import "../styles/Title.less";

export interface TitleProperties {
  context: TitleViewModel;
}

@observer
export class Title extends React.Component<TitleProperties> {
  constructor(props: any) {
    super(props);

    this.tryLogin = this.tryLogin.bind(this);
    this.onRegistered = this.onRegistered.bind(this);
    this.onLoginSuccessful = this.onLoginSuccessful.bind(this);
    this.onRegisterRequested = this.onRegisterRequested.bind(this);
  }

  // TODO: the code here used to show the login immediately if no valid token existed...
  // we need to re-add that functionality to prevent random user interfaces from showing up before login
  // public componentWillReceiveProps(props: TitleProperties) {
  //   if (props.showLogin) {
  //     this.tryLogin();
  //   }
  // }

  /**
   *
   * @returns {JSX.Element}
   */
  public render(): JSX.Element {
    const applicationModel = this.props.context._applicationModel;
    const loginModalViewModel = new LoginModalViewModel(new ModelFactory(), new AuthorizationService(new RestGateway()));
    return (
      <div className="title-container">
        <span className="title-section-menu-icon" onClick={() => {
          applicationModel.mainMenuVisible = !applicationModel.mainMenuVisible;
        }}>
          <img className="title-section-menu-icon-img" src="./img/menu-icon.svg" />
        </span>
        <span className="title-section-app-title unselectable">
          Student Management Application
        </span>
        <span className="title-section-login-icon" onClick={this.tryLogin}>
          <img className="title-section-menu-icon-img" src="./img/login.svg" />
        </span>

        <RegisterAccountModal onRegisteredSuccessfully={this.onRegistered} loginModel={new Login()} />
        <LoginModal onLoginSuccessful={this.onLoginSuccessful} onRegisterRequested={this.onRegisterRequested} context={loginModalViewModel} />

      </div>
    );
  }

  private onRegistered(): void {
    this.props.context.onRegistered();
  }

  private onRegisterRequested(): void {
    this.props.context.onRegisterRequested();
  }

  private onLoginSuccessful() {
    this.props.context.onLoginSuccessful();
  }

  private tryLogin() {
    this.props.context.tryLogin();
  }
}
