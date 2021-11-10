import { observer } from "mobx-react";
import * as React from 'react';
import FolderWatcherClient from 'src/model/FolderWatcherClient';
import './torrent-grid.css';


@observer class FolderWatcherGrid extends React.Component<{ client: FolderWatcherClient }> {
    public render() {

        
        return (<div />);
    }
}


export default FolderWatcherGrid;
