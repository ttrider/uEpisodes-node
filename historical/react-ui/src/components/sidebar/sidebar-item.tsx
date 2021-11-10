import { action } from 'mobx';
import { observer } from "mobx-react";
import * as React from 'react';
import ColorDot from '../common/color-dot';
import gear from '../gear.svg';


@observer class SidebarItem extends React.Component<{ item: ISidebarItem }> {
    public render() {

        const item = this.props.item;

        return (
            <div className={item.selected ? "sb-item sb-item-selected" : "sb-item"} onClick={this.select}>
                <div className="sb-item-dot">
                    <ColorDot color="green" />
                </div>
                <div className="sb-item-text">
                    <div>{item.title}</div>
                    <div>{item.subTitle}</div>
                </div>
                <div className="sb-item-cmd">
                    <img src={gear} />
                </div>
            </div>
        );
    }

    @action.bound
    private select() {
        this.props.item.select();
    }
}

export default SidebarItem;