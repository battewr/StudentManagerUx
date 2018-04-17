import * as React from "react";
import { Constants } from "../shared/Constants";

export interface RegisterAccountModalState {
    userName: string;
    password: string;
    restResponse: string;
}

export interface RegisterAccountModalProperties {
    onRegisteredSuccessfully(): void;
}

export class RegisterAccountModal extends React.Component<RegisterAccountModalProperties, RegisterAccountModalState> {

    constructor(props: any) {
        super(props);

        this.state = {
            userName: "",
            password: "",
            restResponse: "",
        };
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
                    aria-describedby="inputGroup-sizing-default" value={this.state.userName}
                    onChange={this.onUserNameInputChanged.bind(this)} />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Password</span>
                </div>
                <input type="password" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={this.state.password}
                    onChange={this.onPasswordChanged.bind(this)} />
            </div>
            <button type="button" onClick={this.onAttemptRegister.bind(this)} className="btn btn-secondary cx-margin-top">Register</button>
            <div>{this.state.restResponse}</div>
        </div>;
    }

    private onAttemptRegister() {
        fetch(Constants.BackendUri + "registerGuardian", {
            body: JSON.stringify({ userName: this.state.userName, password: this.state.password }),
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
        }).then((response) => {
            this.setState({ restResponse: `http status ${response.status}` });

            if (response.status === 200) {
                this.props.onRegisteredSuccessfully();
            }
        }).catch((err) => {
            this.setState({ restResponse: `Post Error: ${err}` });
        });
    }

    private onUserNameInputChanged(event: any) {
        let userName = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
            userName = event.target.value;
        }

        this.setState({ userName });
    }

    private onPasswordChanged(event: any) {
        let password = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
            password = event.target.value;
        }
        this.setState({ password });
    }
}