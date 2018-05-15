import { action } from "mobx";
import { IModelFactory } from "../../shared/ModelFactory";
import { IAuthorizationService } from "../../Services/AuthorizationService";
import { BaseApplicationViewModel, IBaseApplicationViewModel } from "../BaseApplicationViewModel";
import { injectable, inject } from "inversify";
import { Factory_Types, Service_Types } from "../../Types";

export interface ILayoutViewModel extends IBaseApplicationViewModel {
    onPageLoad(): void;
}

@injectable()
export class LayoutViewModel extends BaseApplicationViewModel implements ILayoutViewModel {
    public constructor(
        @inject(Factory_Types.IModelFactory) modelFactory: IModelFactory,
        @inject(Service_Types.IAuthorizationService) private _authorizationService: IAuthorizationService) {
        super(modelFactory);
    }

    @action
    public onPageLoad() {
        this._authorizationService.LoadSecurityContext(this._applicationModel.authorizationToken).then((result) => {
            if (!result) {
                this._applicationModel.authorizationToken = null;
            }

            this._applicationModel.loading = false;
        });
    }
}