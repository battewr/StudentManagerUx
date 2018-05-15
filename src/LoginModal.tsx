import * as React from "react";
import { observer } from "mobx-react";
import { LoginModalViewModel } from "./ViewModels/Modal/LoginModalViewModel";

export interface LoginModelProperties {
    context: LoginModalViewModel;

    onRegisterRequested(): void;
    onLoginSuccessful(): void;

}

@observer
export class LoginModal extends React.Component<LoginModelProperties> {

    constructor(props: any) {
        super(props);
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
        const loginModel = this.props.context._loginModel;
        return <div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">User Name</span>
                </div>
                <input type="text" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={loginModel.userName}
                    onChange={this.onUserNameInputChanged.bind(this)} />
            </div>
            <div className="input-group mb-3">
                <div className="input-group-prepend">
                    <span className="input-group-text" id="inputGroup-sizing-default">Password</span>
                </div>
                <input type="password" className="form-control" aria-label="Default"
                    aria-describedby="inputGroup-sizing-default" value={loginModel.password}
                    onChange={this.onPasswordChanged.bind(this)} />
            </div>
            <button type="button" onClick={this.onAttemptLogin.bind(this)} className="btn btn-secondary cx-margin-top">Login</button>
            <button type="button" onClick={this.props.onRegisterRequested} className="btn btn-secondary cx-margin-top">Register</button>
            <div>{loginModel.restResponse}</div>
        </div>;
    }

    private onAttemptLogin() {
        this.props.context.tryLogin().then((result) => {
            if (!!result) {
                this.props.onLoginSuccessful();
            }
        });
    }

    private onUserNameInputChanged(event: any) {
        let userName = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
            userName = event.target.value;
        }

        const loginModel = this.props.context._loginModel;
        loginModel.userName = userName;
    }

    private onPasswordChanged(event: any) {
        let password = "";
        if (!!event && !!event.target && !!event.target.value &&
            typeof event.target.value === "string") {
            password = event.target.value;
        }

        const loginModel = this.props.context._loginModel;
        loginModel.password = password;
    }
}