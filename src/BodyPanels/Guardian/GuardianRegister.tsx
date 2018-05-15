import * as React from "React";
import * as uuid from "uuid";

import { Constants } from "../../shared/Constants";
import { EmailInput } from "../../shared/Components/EmailInput";

import "../../../styles/MainShared.less";

export interface GuardianRegisterProperties {
  authorizationToken: string;
}

export interface GuardianRegisterState {
  name: string;
  email: string;
  postResult: string;
}

export class GuardianRegister extends React.Component<
  GuardianRegisterProperties,
  GuardianRegisterState
> {
  constructor(props: any) {
    super(props);

    this.state = {
      name: "",
      email: "",
      postResult: null
    };

    this.onGuardianEmailInputChanged = this.onGuardianEmailInputChanged.bind(this);
  }

  /**
   * TODO: Cleanup the styles... after refactor I broke where all these belong
   * @returns {JSX.Element}
   */
  public render(): JSX.Element {
    return (
      <div className="create-class-container">
        <h2 className="unselectable"> Register a new Guardian! </h2>
        <div className="input-group mb-3">
          <div className="input-group-prepend">
            <span className="input-group-text" id="inputGroup-sizing-default">
              Name
            </span>
          </div>
          <input
            type="text"
            className="form-control"
            aria-label="Default"
            aria-describedby="inputGroup-sizing-default"
            value={this.state.name}
            onChange={this.onGuardianNameInputChanged.bind(this)}
          />
        </div>
        <EmailInput onEmailChanged={this.onGuardianEmailInputChanged} email={this.state.email} />
        <button
          type="button"
          onClick={this.onSubmitNewGuardian.bind(this)}
          className="btn btn-secondary cx-margin-top"
        >
          Register Guardian
        </button>
        {this.renderPostResult()}
      </div>
    );
  }

  /**
   * @returns {}
   */
  private renderPostResult(): JSX.Element {
    if (!this.state.postResult) {
      return null;
    }

    return (
      <div className="create-class-post-result">
        <span>{this.state.postResult}</span>
      </div>
    );
  }

  /**
   * not safe to directly access this.state here... changes to state may be pending....
   * TODO: check into how to do this properly?
   */
  private onSubmitNewGuardian() {
    this.setState({}, () => {
      const newGuardianId = uuid().toString();
      const networkGuardianObject: Object = {
        Name: this.state.name,
        Email: this.state.email,
        Id: newGuardianId
      };

      fetch(Constants.BackendUri + "guardian", {
        body: JSON.stringify(networkGuardianObject),
        headers: {
          "content-type": "application/json",
          "sm-authorization-header": this.props.authorizationToken || ""
        },
        method: "POST"
      })
        .then(response => {
          this.setState({
            postResult: `Finished: ${response.status.toString()} : ${
              response.statusText
            } : ${newGuardianId}`
          });
        })
        .catch(err => {
          this.setState({ postResult: `Post Error: ${err}` });
        });
    });
  }

  /**
   *
   * @param event
   * @returns {void}
   */
  private onGuardianNameInputChanged(event: any): void {
    if (
      !event ||
      !event.target ||
      !event.target.value ||
      typeof event.target.value !== "string"
    ) {
      this.setState({ name: "" });
    }
    this.setState({ name: event.target.value });
  }

  /**
   *
   * @param event
   * @returns {void}
   */
  private onGuardianEmailInputChanged(newEmail: string): void {
      this.setState({email: newEmail});
  }
}
