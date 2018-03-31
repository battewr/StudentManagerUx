import * as React from "React";
import { SelectedPanel } from "./shared/Enums";

import "../styles/Shared.less";
import "../styles/RightMenuPanel.less";

export interface RightMenuPanelProperties {
    isPanelVisible: boolean;
    selectedMenuItem: SelectedPanel;
    onPanelSelectChanged: (panelSelected: SelectedPanel) => void;
}

interface RightMenuPanelOptions {
    key: SelectedPanel;
    displayValue: string;
}

const createStudent: SelectedPanel = SelectedPanel.CreateStudent;
const listStudent: SelectedPanel = SelectedPanel.ListStudents;
const menuOptions: RightMenuPanelOptions[] = [
    {key: createStudent, displayValue: "New Student"},
    {key: listStudent, displayValue: "Student List"}
];

export class RightMenuPanel extends React.Component<RightMenuPanelProperties> {
    constructor(props: any) {
        super(props);
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        let panelClass = "right-menu-panel";
        if (!this.props.isPanelVisible) {
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

        menuOptions.forEach((menuItem) => {
            let menuItemClassFinal = menuItemClass;
            if (this.props.selectedMenuItem === menuItem.key) {
                menuItemClassFinal += " selected-menu-option";
            }
            menuOptionList.push(<div className={menuItemClassFinal} onClick={() => { this.props.onPanelSelectChanged(menuItem.key); }}>{menuItem.displayValue}</div>);
        });

        return menuOptionList;
    }
};