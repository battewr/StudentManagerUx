import { observable } from "mobx";
import { SelectedPanel } from "../shared/Enums";

export interface IBaseEditTarget { }

export class Layout {

    @observable selectedPanel: SelectedPanel;
    @observable editTarget: IBaseEditTarget;

    constructor() {
        this.selectedPanel = SelectedPanel.StudentList;
    }
}
