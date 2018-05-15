import { observable, computed } from "mobx";
import { LocalStorageWrapper } from "../shared/LocalStorageWrapper";
import { Constants } from "../shared/Constants";

export class App {
    @observable mainMenuVisible: boolean;
    @observable loading: boolean;
    @observable authorizationToken: string;
    @computed get shouldRenderLogin() {
        if (!!this.authorizationToken && this.authorizationToken.length > 0) {
            return false;
        }
        return true;
    }

    constructor() {
        this.mainMenuVisible = true;
        this.authorizationToken = LocalStorageWrapper.get().getItem(Constants.AuthorizationTokenKey);
        this.loading = true;
    }
}