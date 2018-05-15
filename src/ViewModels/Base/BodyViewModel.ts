import { action } from "mobx";
import { inject, injectable } from "inversify";

import { SelectedPanel } from "../../shared/Enums";
import { IModelFactory } from "../../shared/ModelFactory";

import { IBaseEditTarget } from "../../Model/Layout";
import { BaseApplicationViewModel, IBaseApplicationViewModel } from "../BaseApplicationViewModel";
import { Factory_Types } from "../../Types";

export interface IBodyViewModel extends IBaseApplicationViewModel {
    setEditTarget(editTarget: IBaseEditTarget, changePage?: SelectedPanel): void;
}

@injectable()
export class BodyViewModel extends BaseApplicationViewModel implements IBodyViewModel {
    constructor(
        @inject(Factory_Types.IModelFactory) modelFactory: IModelFactory) {
        super(modelFactory);
    }

    @action
    public setEditTarget(editTarget: IBaseEditTarget, changePage: SelectedPanel = null): void {
        this._layoutModel.editTarget = editTarget;
        if (changePage) {
            this._layoutModel.selectedPanel = changePage;
        }
    }

}