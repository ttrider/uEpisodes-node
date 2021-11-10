import { observer } from "mobx-react";
import * as React from 'react';
import TorrentPackage from 'src/model/TorrentPackage';
import TorrentPackageFile from 'src/model/TorrentPackageFile';
import TorrentPackageFolder from 'src/model/TorrentPackageFolder';
import TorrentPackageItem from 'src/model/TorrentPackageItem';
import uticon from "../../images/utorrent-icon.png";
import Arrow from '../common/arrow';
import ColorDot from '../common/color-dot';
import TorrentFileItem from './torrent-file-item';
import TorrentFolderItem from './torrent-folder-item';
import './torrent-grid.css';
import TorrentProgress from './torrent-progress';


@observer class TorrentItem extends React.Component<{ pack: TorrentPackage, index: number }> {
    public render() {

        const pack = this.props.pack;

        let status = pack.status;
        if (status === "downloading") {
            status += " - " + Math.round(pack.percentReady * 100).toString() + "%";
        }

        if (pack) {
            return (
                <>
                    <div className="tr-tor-name tr-title" title={pack.name}>
                        <Arrow direction={pack.expanded ? "down" : "left"} clickHandler={pack.toggleExpanded} />
                        <ColorDot color="blue" />
                        <img src={uticon} />
                        <div>{pack.name}</div>
                    </div>
                    <TorrentProgress status={pack.status} percentReady={pack.percentReady} />
                    <div className="tr-command">cmd here</div>

                    {this.renderFiles()}
                </>
            );
        }
        return (<div />);
    }

    private renderFiles() {

        if (this.props.pack.expanded) {
            return renderItems(this.props.pack.items, this.props.index);
        }
        return;
    }
}


export function renderItems(items: TorrentPackageItem[], index: number) {
    return items.map((item) => {
        return (item instanceof TorrentPackageFolder)
            ? (<TorrentFolderItem key={item.path} folder={item as TorrentPackageFolder} index={index} />)
            : (<TorrentFileItem key={item.path} packFile={item as TorrentPackageFile} index={index} />)
    }
    );
}

/*                    

                    <div className="tr-file-arrow">&gt;</div>
                    <div className="tr-file-name">Star.Trek.Discovery.S01E01.mkv</div>
                    <div className="tr-show-name">Star Trek Discovery</div>
                    <div className="tr-show-season">S01</div>
                    <div className="tr-show-episode">E01</div>
                    <div className="tr-show-title">The Vulcan Hello</div>
                    <div className="tr-command">do something</div>

                    <div className="tr-file-arrow tr-row-even">&gt;</div>
                    <div className="tr-file-name tr-row-even">Star.Trek.Discovery.S01E02.mkv</div>
                    <div className="tr-show-name tr-row-even">Star Trek Discovery</div>
                    <div className="tr-show-season tr-row-even">S01</div>
                    <div className="tr-show-episode tr-row-even">E02</div>
                    <div className="tr-show-title tr-row-even">Blah Blah Blah Blah Blah Blah</div>
                    <div className="tr-command tr-row-even">foo</div>

                    <div className="tr-tor-arrow">dn</div>
                    <div className="tr-tor-name">adsfghjkuwiheiuwhfiuwhifhwihefwuiefwuef</div>
                    <div className="tr-status">downloading - 10%</div>
                    <div className="tr-command">ignore</div> */


export default TorrentItem;
