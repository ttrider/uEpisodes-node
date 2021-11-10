import { observer } from "mobx-react";
import * as React from 'react';
import './torrent-grid.css';


@observer class TorrentProgress extends React.Component<{ status: TorrentStatus, percentReady: number }> {
    public render() {
        const percent = Math.round(this.props.percentReady * 100).toString() + "%";
        const status = (this.props.status === "downloading") ? (this.props.status + " - " + percent) : this.props.status;

        if (this.props.status === "downloading") {
            const background = (this.props.percentReady >= 1)
                ? { background: "rgba(114,186,138,1)" }
                : {
                    background: `linear-gradient(to right,rgba(114,186,138,1) 0%, rgba(114,186,138,0) ${percent},rgba(114,186,138,0) 100%)`,
                    borderRight: "1px solid rgba(114,186,138,1)"
                }

            return (
                <div className="tr-status" style={background}>{status}</div>
            );
        } else {
            return (
                <div className="tr-status">{status}</div>
            );
        }
    }
}

export default TorrentProgress;
