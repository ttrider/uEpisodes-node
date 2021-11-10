import TorrentPackage from './TorrentPackage';
import TorrentPackageItem from './TorrentPackageItem';

class TorrentPackageFolder extends TorrentPackageItem {

    public items: TorrentPackageItem[] = [];

    constructor(owner: TorrentPackage, name: string, path: string, items: TorrentPackageItem[]) {
        super(owner, name, path);

        this.items = items;
        for (const item of items) {
            item.parent = this;
            item.owner = this.owner;
        }
    }


    
}

export default TorrentPackageFolder;