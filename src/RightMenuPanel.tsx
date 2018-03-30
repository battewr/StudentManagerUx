import * as React from "React";

import "../styles/Shared.less";
import "../styles/RightMenuPanel.less";

export interface RightMenuPanelProperties {
    isPanelVisible: boolean;
}

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

        const menuItemClass = "right-menu-panel-menu-option unselectable";
        return <div className={panelClass}>
            <div className={menuItemClass}>New Student</div>
            <div className={menuItemClass}>Student List</div>
        </div>;
    }
};