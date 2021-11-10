import { observer } from "mobx-react";
import * as React from 'react';
import FileSystemClient from 'src/model/FileSystemClient';
import './torrent-grid.css';


@observer class FileSystemGrid extends React.Component<{ client: FileSystemClient }> {
    public render() {

        
        return (<div />);
    }
}


export default FileSystemGrid;
