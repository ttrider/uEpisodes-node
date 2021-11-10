import { action, observable } from "mobx";
import TorrentPackage from './TorrentPackage';
import TorrentPackageFolder from './TorrentPackageFolder';

class TorrentPackageItem {
    public owner: TorrentPackage;
    public parent?: TorrentPackageFolder;

    @observable public path: string;
    @observable public name: string;

    @observable public expanded: boolean = false;

    public get level(): number {

        if (this.parent) {
            return this.parent.level + 1;
        }
        return 1;
    }

    constructor(owner: TorrentPackage, name: string, path: string) {
        this.owner = owner;
        this.name = name;
        this.path = path;
    }

    @action.bound public setExpanded(expanded: boolean) {
        this.expanded = expanded;
    }
    @action.bound public toggleExpanded() {
        this.expanded = !this.expanded;
    }
}

export default TorrentPackageItem;