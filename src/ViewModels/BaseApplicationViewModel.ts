import { ModelFactory, ModelType } from "../shared/ModelFactory";
import { App } from "../Model/App";
import { Layout } from "../Model/Layout";
import { injectable } from "inversify";

export interface IBaseApplicationViewModel {
    readonly _applicationModel: App;
    readonly _layoutModel: Layout;
}

@injectable()
export class BaseApplicationViewModel implements IBaseApplicationViewModel {
    constructor(protected _modelFactory: ModelFactory) { }

    public get _applicationModel(): App {
        return this._modelFactory.Get<App>(ModelType.App);
    }

    public get _layoutModel(): Layout {
        return this._modelFactory.Get<Layout>(ModelType.Layout);
    }
}
