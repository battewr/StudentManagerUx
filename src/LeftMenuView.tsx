import * as React from "React";
import { observer } from "mobx-react";

import { LeftMenuPanelViewModel } from "./ViewModels/Base/LeftMenuPanelViewModel";

import { SelectedPanel } from "./shared/Enums";

import "../styles/MainShared.less";
import "../styles/RightMenuPanel.less";

export interface LeftMenuPanelProperties {
    context: LeftMenuPanelViewModel;
}

interface LeftMenuPanelOptions {
    key: SelectedPanel;
    displayValue: string;
}

const menuOptions: LeftMenuPanelOptions[] = [
    { key: SelectedPanel.StudentRegistration, displayValue: "Register Student" },
    { key: SelectedPanel.StudentList, displayValue: "Student List" },
    { key: SelectedPanel.ClassRegistration, displayValue: "Register Class" },
    { key: SelectedPanel.ClassList, displayValue: "Full Class List" },
    { key: SelectedPanel.GuardianList, displayValue: "Guardian List" },
    { key: SelectedPanel.GuardianRegistration, displayValue: "Register Guardian" },
];

@observer
export class LeftMenuPanel extends React.Component<LeftMenuPanelProperties> {
    constructor(props: any) {
        super(props);
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const applicationModel = this.props.context._applicationModel;
        let panelClass = "right-menu-panel";
        if (!applicationModel.mainMenuVisible) {
            panelClass += " collapsed";
        }

        return (<div className={panelClass}>
            {this.renderMenuList()}
        </div>);
    }

    /**
     *
     */
    private renderMenuList(): JSX.Element[] {
        const menuOptionList: JSX.Element[] = [];
        const menuItemClass = "right-menu-panel-menu-option unselectable";

        const layoutModel = this.props.context._layoutModel;

        menuOptions.forEach((menuItem) => {
            let menuItemClassFinal = menuItemClass;
            if (layoutModel.selectedPanel === menuItem.key) {
                menuItemClassFinal += " selected-menu-option";
            }
            menuOptionList.push(
                <div className={menuItemClassFinal}
                    onClick={() => { layoutModel.selectedPanel = menuItem.key; }}>
                    {menuItem.displayValue}
                </div>);
        });

        return menuOptionList;
    }
};