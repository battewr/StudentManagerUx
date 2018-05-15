import { BaseApplicationViewModel } from "../BaseApplicationViewModel";
import { ModelFactory, ModelType } from "../../shared/ModelFactory";
import { Login } from "../../Model/Login";
import { App } from "../../Model/App";
import { action } from "mobx";
import { AuthorizationService } from "../../Services/AuthorizationService";
export class LoginModalViewModel extends BaseApplicationViewModel {

    public get _loginModel(): Login {
        return this._modelFactory.Get<Login>(ModelType.Login);
    }

    public get _applicationModel(): App {
        return this._modelFactory.Get<App>(ModelType.App);
    }

    constructor(modelFactory: ModelFactory, private _authorizationService: AuthorizationService) {
        super(modelFactory);
    }

    @action
    public tryLogin(): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            // TODO: use service to login attempt
            this._authorizationService.TryLogin(this._loginModel.userName, this._loginModel.password).then((token) => {
                this._applicationModel.authorizationToken = token;
                resolve(true);
            }).catch((err: any | Error) => {
                this._applicationModel.authorizationToken = null;
                if (err.hasOwnProperty("responseStatus")) {
                    this._loginModel.restResponse = `REST Response was ${err.responseStatus}`;
                } else {
                    this._loginModel.restResponse = `REST Response failed ${err}`;
                }
                resolve(false);
            });

        });
    }
}
