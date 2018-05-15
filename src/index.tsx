
// tslint:disable-next-line
import * as React from "react";
import * as ReactDOM from "react-dom";

/** DI */
import { container } from "./Dependencies";
import { ViewModel_Types } from "./Types";

import { LayoutView } from "./LayoutView";
import { ILayoutViewModel } from "./ViewModels/Base/LayoutViewModel";

ReactDOM.render(
    <LayoutView context={container.get<ILayoutViewModel>(ViewModel_Types.ILayoutViewModel)} />,
    document.getElementById("app")
);