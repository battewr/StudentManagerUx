import * as React from "react";
import { Constants } from "./shared/Constants";
import { Login } from "./Model/Login";
import { observer } from "mobx-react";

export interface RegisterAccountModalProperties {
    loginModel: Login;
    onRegisteredSuccessfully(): void;
}

@observer
export class RegisterAccountModal extends React.Component<RegisterAccountModalProperties> {

    constructor(props: any) {
        super(props);
    }

    public render() {
        return <div className="modal fade" id="register-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Register New User</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {this.renderRegistrationBody()}
                    </div>
                </div>
            </div>
        </div>;
    }

    private renderRegistrationBody(): JSX.Element {
        return <div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">User Name</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.props.loginModel.userName}
                    onChange={this.onUserNameInputChanged.bind(this)} />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Password</span>
                </div>
                <input type="password" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.props.loginModel.password}
                    onChange={this.onPasswordChanged.bind(this)} />
            </div>
            <button type="button" onClick={this.onAttemptRegister.bind(this)} className="btn btn-secondary cx-margin-top">Register</button>
            <div>{this.props.loginModel.restResponse}</div>
        </div>;
    }

    private onAttemptRegister() {
        fetch(Constants.BackendUri + "registerGuardian", {
            body: JSON.stringify({ userName: this.props.loginModel.userName, password: this.props.loginModel.password }),
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
        }).then((response) => {
            this.props.loginModel.restResponse = `Post Error: ${response.status}`;

            if (response.status === 200) {
                this.props.onRegisteredSuccessfully();
            }
        }).catch((err) => {
            this.props.loginModel.restResponse = `Post Error: ${err}`;
        });
    }

    private onUserNameInputChanged(event: any) {
        let userName = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
            userName = event.target.value;
        }

        this.props.loginModel.userName = userName;
    }

    private onPasswordChanged(event: any) {
        let password = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
            password = event.target.value;
        }

        this.props.loginModel.password = password;
    }
}