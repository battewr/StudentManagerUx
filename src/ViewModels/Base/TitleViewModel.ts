import { action } from "mobx";
import { ModelFactory } from "../../shared/ModelFactory";
import { BaseApplicationViewModel } from "../BaseApplicationViewModel";
import { LocalStorageWrapper } from "../../shared/LocalStorageWrapper";
import { Constants } from "../../shared/Constants";
export class TitleViewModel extends BaseApplicationViewModel {
    constructor(private modelFactory: ModelFactory) {
        super(modelFactory);
    }

    @action
    public onRegistered(): void {
        this.setVisibleRegister("hide");
        this.setVisibleLogin("show");
    }

    @action
    public onRegisterRequested(): void {
        this.setVisibleLogin("hide");
        this.setVisibleRegister("show");
    }

    @action
    public onLoginSuccessful() {
        this.setVisibleLogin("hide");

        console.log("Login successful, closing modal");
        LocalStorageWrapper.get().setItem(Constants.AuthorizationTokenKey, this._applicationModel.authorizationToken);
    }

    @action
    public tryLogin() {
        if (this._applicationModel.authorizationToken && this._applicationModel.authorizationToken.length > 0) {
            LocalStorageWrapper.get().removeItem(Constants.AuthorizationTokenKey);
            this._applicationModel.authorizationToken = null;
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