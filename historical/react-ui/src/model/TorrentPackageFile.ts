import { observable } from "mobx";
import TorrentPackage from './TorrentPackage';
import TorrentPackageItem from './TorrentPackageItem';

class TorrentPackageFile extends TorrentPackageItem {

    @observable public length: number;
    @observable public percentReady: number;
    @observable public status: TorrentStatus;

    constructor(owner: TorrentPackage, name: string, path: string,length: number,status: TorrentStatus,  percentReady: number) {
        super(owner, name, path);

        this.length = length;
        this.status = status;
        this.percentReady = percentReady;
    }
}

export default TorrentPackageFile;