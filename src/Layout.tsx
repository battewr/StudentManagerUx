import * as React from 'React';

import '../styles/Layout.less';

export interface LayoutProperties {

}

export class Layout extends React.Component<LayoutProperties> {
    constructor(props: any) {
        super(props);
    }

    public render() {
        return <div className='mainAppRoot'>
            <div className='titleSection'>Header</div>
            <div className='mainBodySection'>Body</div>
            <div className='footerSection'>Footer</div>
        </div>;
    }
};