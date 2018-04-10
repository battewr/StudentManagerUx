import * as React from "react";

export interface EmailInputProperties {
  email: string;
  onEmailChanged(newEmailValue: string): void;
}

export class EmailInput extends React.Component<EmailInputProperties> {
  /**
   * .ctor
   * @param props
   */
  constructor(props: EmailInputProperties) {
    super(props);
  }

  public render() {
    const isValidEmail = this.isValidEmail();

    let emailInputClass = "form-control";
    if (!isValidEmail) {
        emailInputClass += " is-invalid";
    }
    return (
      <div className="input-group mb-3">
        <div className="input-group-prepend">
          <span className="input-group-text" id="inputGroup-sizing-default">
            Email
          </span>
        </div>
        <input
          type="text"
          className={emailInputClass}
          aria-label="Default"
          aria-describedby="inputGroup-sizing-default"
          value={this.props.email}
          onChange={this.onEmailInputChanged.bind(this)}
        />
        <div className="invalid-feedback">Invalid Email Address format!</div>
      </div>
    );
  }

  private onEmailInputChanged(event: any) {
    if (
      !event ||
      !event.target ||
      !event.target.value ||
      typeof event.target.value !== "string"
    ) {
      this.props.onEmailChanged("");
    }
    this.props.onEmailChanged(event.target.value);
  }

  private isValidEmail(): boolean {
    const regex = RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regex.test(this.props.email);
  }
}
