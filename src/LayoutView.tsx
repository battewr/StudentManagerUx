/** tpl */
import * as React from "React";
import { observer } from "mobx-react";

import { container } from "./Dependencies";
import { ViewModel_Types } from "./Types";

/** legacy */
import { Title } from "./TitleView";
import { BodyView } from "./BodyView";
import { LeftMenuPanel } from "./LeftMenuView";

/** models */
import { ModelFactory } from "./shared/ModelFactory";

/** view models */
import { ILayoutViewModel } from "./ViewModels/Base/LayoutViewModel";
import { IBodyViewModel } from "./ViewModels/Base/BodyViewModel";
import { LeftMenuPanelViewModel } from "./ViewModels/Base/LeftMenuPanelViewModel";
import { TitleViewModel } from "./ViewModels/Base/TitleViewModel";

/** styles */
import "../styles/Layout.less";

export interface LayoutProperties {
    context: ILayoutViewModel;
};

@observer
export class LayoutView extends React.Component<LayoutProperties> {
    public componentWillMount() {
        this.props.context.onPageLoad();
    }

    /**
     *
     * @returns {JSX.Element}
     */
    public render(): JSX.Element {
        const applicationModel = this.props.context._applicationModel;

        const leftMenuPanelViewModel = new LeftMenuPanelViewModel(new ModelFactory());
        const titleViewModel = new TitleViewModel(new ModelFactory());

        return <div className="main-app-root">
            <span>{applicationModel.authorizationToken}</span>
            <div className="title-section">
                <Title context={titleViewModel} />
            </div>

            <div className="main-body-section">
                <LeftMenuPanel context={leftMenuPanelViewModel} />

                <BodyView context={container.get<IBodyViewModel>(ViewModel_Types.IBodyViewModel)} />
            </div>
            <div className="footer-section">
                {/* TODO */}
                &nbsp;
            </div>
        </div>;
    }
};