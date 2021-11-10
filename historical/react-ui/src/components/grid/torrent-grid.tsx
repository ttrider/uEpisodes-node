import { observer } from "mobx-react";
import * as React from 'react';
import TorrentClient from 'src/model/TorrentClient';
import './torrent-grid.css';
import TorrentItem from './torrent-item';


@observer class TorrentGrid extends React.Component<{ client: TorrentClient }> {
    public render() {

        const client = this.props.client;


        if (client) {
            return (
                <div className="torrent-grid">
                    {
                        client.packages.map((pack, index) =>
                            <TorrentItem key={pack.name} pack={pack} index={index} />
                        )
                    }
                </div>
            );
        }
        return (<div />);
    }
}


export default TorrentGrid;
