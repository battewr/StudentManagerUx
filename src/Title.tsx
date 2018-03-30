import * as React from "React";

import "../styles/Shared.less";
import "../styles/Title.less";

export interface TitleProperties {
    onToggleMenu(): void;
}

export class Title extends React.Component<TitleProperties> {
    constructor(props: any) {
        super(props);
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        return <div className="title-container">
            <span className="title-section-menu-icon" onClick={this.props.onToggleMenu}>
                <img className="title-section-menu-icon-img" src="./img/menu-icon.svg" />
            </span>
            <span className="title-section-app-title unselectable">
                Student Management Application
            </span>
        </div>;
    }
};