import { observer } from "mobx-react";
import * as React from 'react';
import Client from 'src/model/Client';
import FileSystemClient from 'src/model/FileSystemClient';
import FolderWatcherClient from 'src/model/FolderWatcherClient';
import TorrentClient from 'src/model/TorrentClient';
import Application from "../../model/Application";
import FileSystemGrid from '../grid/file-system-grid';
import FolderWatcherGrid from '../grid/folder-watcher-grid';
import TorrentGrid from '../grid/torrent-grid';
import Header from '../header/header';
import './workspace.css';


@observer class Workspace extends React.Component<{ app: Application }> {
    public render() {
        const { app } = this.props;
        const client = app.selectedItem;
        const viewType = client ? client.viewType : null;

        return (
            <div className="workspace">
                <Header app={app} />
                <div className="content" >
                    {this.viewSelector(client as Client, viewType)}
                </div>
            </div>
        );
    }

    private viewSelector(client: Client, viewType: ViewTypes) {

        switch (viewType) {
            case "TorrentClientView":
                return (<TorrentGrid client={client as TorrentClient} />);
            case "FolderWatcherClientView":
                return (<FolderWatcherGrid client={client as FolderWatcherClient} />);
            case "FileSystemClientView":
                return (<FileSystemGrid client={client as FileSystemClient} />);
        }
        return;

    }

}


export default Workspace;