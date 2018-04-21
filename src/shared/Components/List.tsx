import * as React from "react";

import "../../../styles/MainShared.less";
import "../../../styles/List.less";

export interface ListColumnDefinition<T> {
    titleDisplayValue: string;
    renderer: (valueToRender: T) => JSX.Element;
}

export interface ListProperties<T> {
    columns: ListColumnDefinition<T>[];
    data: T[];

    estimatedMaxItems?: number;
    pageSize?: number;
    selectedPage?: number;
    loadPage?(targetPageIndex: number): void;
}

export class List<T> extends React.Component<ListProperties<T>> {
    constructor(props: ListProperties<T>) {
        super(props);
    }

    public render(): JSX.Element {
        if (!this.props.data) {
            return <div></div>;
        }
        return <div>
            <table className="table">
                <thead>
                    <tr>
                        {this.generateListHeader()}
                    </tr>
                </thead>
                <tbody>
                    {this.generateListBody()}
                </tbody>
            </table>

            {this.renderListPaginationNav()}
        </div>;
    }

    private generateListHeader(): JSX.Element[] {
        const headerEntries: JSX.Element[] = [];
        headerEntries.push(<th scope="col" className="margin-reset">#</th>);
        this.props.columns.forEach((column) => {
            headerEntries.push(<th scope="col" className="margin-reset">{column.titleDisplayValue}</th>);
        });
        return headerEntries;
    }

    private generateListBody(): JSX.Element[] {
        // bbax: multiple <tr> entries that make up the row for
        // each data row...
        const bodyEntries: JSX.Element[] = [];
        this.props.data.forEach((dataEntry, index) => {
            // bbax: multiple <td> entries that make up each cell inside
            // the row correspnding to rendering the data...
            const columnEntries: JSX.Element[] = [];

            // bbax: hard coded # indication row corresponding to header hard coding
            columnEntries.push(<th scope="row" className="margin-reset">
            <div className="cx-padding-top">{index}</div></th>);
            this.props.columns.forEach((column) => {
                // bbax: render cell and place inside the TD, rollup to row
                const renderedListEntry = column.renderer(dataEntry);
                columnEntries.push(<td className="margin-reset">{renderedListEntry}</td>);
            });
            const backgroundStyle = index % 2 === 0 ? "alternate-background" : "";
            bodyEntries.push(<tr className={backgroundStyle}>{columnEntries}</tr>);
        });
        return bodyEntries;
    }

    private estimatedMaxPage(props: ListProperties<T>): number {
        return Math.ceil(props.estimatedMaxItems / props.pageSize);
    }

    private renderListPaginationNav(): JSX.Element {

        if (!this.props.estimatedMaxItems) {
            return null;
        }

        const maxPage = this.estimatedMaxPage(this.props);
        const prevButtonClass = this.props.selectedPage < 1 ? "page-item disable" : "page-item";
        const nextButtonClass = this.props.selectedPage >= maxPage ? "page-item disable" : "page-item";

        const paginationEntries: JSX.Element[] = [];
        for (let i = 0; i < maxPage; i++) {
            if (i === this.props.selectedPage) {
                paginationEntries.push(<li className="page-item active">
                    <a className="page-link" onClick={() => {
                        this.props.loadPage(i);
                    }} href="#">{i + 1} <span className="sr-only">(current)</span></a>
                </li>);
            } else {
                paginationEntries.push(<li className="page-item">
                    <a className="page-link" onClick={() => {
                        this.props.loadPage(i);
                    }} href="#">{i + 1}</a>
                </li>);
            }
        }

        return <nav aria-label="...">
            <ul className="pagination">
                <li className={prevButtonClass}>
                    <a className="page-link" href="#" onClick={() => {
                        this.props.loadPage(this.props.selectedPage - 1);
                    }} tabIndex={-1}>Previous</a>
                </li>

                {paginationEntries}

                <li className={nextButtonClass}>
                    <a className="page-link" onClick={() => {
                        this.props.loadPage(this.props.selectedPage - 1);
                    }} href="#">Next</a>
                </li>
            </ul>
        </nav>;
    }
}