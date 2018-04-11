import * as React from "react";
import { Constants } from "../shared/Constants";

export interface LoginModalState {
    userName: string;
    password: string;
    restResponse: string;
}

export class LoginModal extends React.Component<any, LoginModalState> {

    constructor(props: any) {
        super(props);

        this.state = {
            userName: "",
            password: "",
            restResponse: "",
        };
    }

    public render() {
        return <div className="modal fade" id="login-modal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog" role="document">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">Login</h5>
                        <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {this.renderLoginBody()}
                    </div>
                </div>
            </div>
        </div>;
    }

    private renderLoginBody(): JSX.Element {
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
            <button type="button" onClick={this.onAttemptLogin.bind(this)} className="btn btn-secondary cx-margin-top">Login</button>
            <div>{this.state.restResponse}</div>
        </div>;
    }

    private onAttemptLogin() {
        fetch(Constants.BackendUri + "login", {
            body: JSON.stringify({userName: this.state.userName, password: this.state.password}),
            headers: {
                "content-type": "application/json"
            },
            method: "POST",
        }).then((response) => {
            this.setState({ restResponse: `Finished: ${response.status.toString()} : ${response.statusText}` });
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