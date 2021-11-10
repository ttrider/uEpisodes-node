import { observer } from "mobx-react";
import * as React from 'react';
import Application from 'src/model/Application';
import ColorDot from '../common/color-dot';
import "./header.css";


@observer class Header extends React.Component<{ app: Application }> {
    public render() {

        const active = this.props.app.selectedItem;

        if (active) {
            return (
                <div className="header">
                    <div className="hdr-dot">
                        <ColorDot color="red" />
                    </div>
                    <div className="hdr-name">
                        <div>{active.title}</div>
                        <div>{active.subTitle}</div>
                    </div>
                </div>

            );
        }
        return (<div />);
    }
}


export default Header;