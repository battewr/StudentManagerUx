import * as React from "React";
import { LoginModal } from "./BodyPanels/LoginModal";

import "../styles/MainShared.less";
import "../styles/Title.less";

export interface TitleProperties {
  onToggleMenu(): void;
  onLoginSuccessful(token: string, expiresAt: string): void;
}

export class Title extends React.Component<TitleProperties> {
  constructor(props: any) {
    super(props);

    this.tryLogin = this.tryLogin.bind(this);
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

        <LoginModal onLoginSuccessful={this.props.onLoginSuccessful} />
      </div>
    );
  }

  private tryLogin() {
    const component: any = $("#login-modal");
    component.modal("show");
  }
}
