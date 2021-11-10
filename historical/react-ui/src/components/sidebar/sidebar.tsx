import { observer } from "mobx-react";
import * as React from 'react';
import Application from "../../model/Application";
// import {Sidebar as SidebarModel} from "../model/sidebar";
import SidebarHeader from "./sidebar-header";
import SidebarSection from './sidebar-section';
import './sidebar.css';


@observer class Sidebar extends React.Component<{ app: Application }> {
    public render() {

        const { sidebarSections, selectedItem } = this.props.app;

        if (!selectedItem) {
            this.props.app.selectItem();
        }

        return (
            <div className="sidebar">
                <SidebarHeader />
                {
                    sidebarSections.map((f, i) =>
                        <SidebarSection key={i} section={f} />
                    )}
                }
            </div>
        );
    }
}


export default Sidebar;