import { observer } from "mobx-react";
import * as React from 'react';
import SidebarItem from './sidebar-item';
import './sidebar.css';


@observer class SidebarSection extends React.Component<{ section: ISidebarSection }> {
    public render() {
        const section = this.props.section;

        return (
            <div className="sb-section">
                <div className="sb-section-title">{section.title}</div>

                {section.items.map((e, i) => <SidebarItem key={i} item={e} />)}

                <div className="sb-section-command">
                    <button onClick={section.commandHandler}>{section.commandName}</button>
                </div>
            </div>
        );
    }
}


export default SidebarSection;