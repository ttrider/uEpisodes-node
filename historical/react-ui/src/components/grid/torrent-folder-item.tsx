import { observer } from "mobx-react";
import * as React from 'react';

import TorrentPackageFolder from 'src/model/TorrentPackageFolder';
import Arrow from '../common/arrow';

import uticon from "../../images/folder-icon.png";
import ColorDot from '../common/color-dot';
import './torrent-grid.css';
import { renderItems } from './torrent-item';


@observer class TorrentFolderItem extends React.Component<{ folder: TorrentPackageFolder, index: number }> {
    public render() {

        const folder = this.props.folder;

        const css: React.CSSProperties = {};
        if (folder.level > 0) {
            css.paddingLeft = (folder.level * 1.5) + "em";
        }

        return (
            <>
                <div className="tr-folder-name tr-title" style={css} title={folder.name}>
                    <Arrow direction={folder.expanded ? "down" : "left"} clickHandler={folder.toggleExpanded} />
                    <ColorDot color="blue" />
                    <img src={uticon} />
                    <div>{folder.name}</div>
                </div>
                <div className="tr-command">cmd here</div>

                {this.renderFiles()}
            </>
        );

    }

    private renderFiles() {

        if (this.props.folder.expanded) {
            return renderItems(this.props.folder.items, this.props.index);
        }
        return;
    }

}

export default TorrentFolderItem;
