
import { ModelFactory } from "../../shared/ModelFactory";
import { BaseApplicationViewModel } from "../BaseApplicationViewModel";

export class LeftMenuPanelViewModel extends BaseApplicationViewModel {
    constructor(private modelFactory: ModelFactory) {
        super(modelFactory);
     }
}