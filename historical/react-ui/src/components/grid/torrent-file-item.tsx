import { observer } from "mobx-react";
import * as React from 'react';
import TorrentPackageFile from 'src/model/TorrentPackageFile';
import Arrow from '../common/arrow';
import ColorDot from '../common/color-dot';
import './torrent-grid.css';


@observer class TorrentFileItem extends React.Component<{ packFile: TorrentPackageFile, index: number }> {
    public render() {

        const file = this.props.packFile;
        const css: React.CSSProperties = {};
        if (file.level > 0) {
            css.paddingLeft = (file.level * 1.5) + "em";
        }

        return (
            <>
                <div className="tr-file-name tr-title" style={css} title={file.name}>
                    <Arrow direction={file.expanded ? "down" : "left"} clickHandler={file.toggleExpanded} />
                    <ColorDot color="blue" />
                    
                    <div>{file.name}</div>
                </div>
                <div className="tr-show-name">Star Trek Discovery</div>
                <div className="tr-show-season">S01</div>
                <div className="tr-show-episode">E01</div>
                <div className="tr-show-title">The Vulcan Hello</div>
                <div className="tr-command">do something</div>
            </>
        );
    }
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


export default TorrentFileItem;
