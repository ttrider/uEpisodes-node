import { action, computed, observable } from "mobx";
import TorrentPackageFile from './TorrentPackageFile';
import TorrentPackageFileTree from './TorrentPackageFileTree';

class TorrentPackage {

    @observable public name: string;
    @observable public percentReady: number;
    @observable public status: TorrentStatus;
    @observable public files: TorrentPackageFile[] = [];

    @computed public get items() {

        const tree = new TorrentPackageFileTree();

        for (const file of this.files) {
            tree.add(file);
        }

        return tree.getItems(this);
    }



    @observable public expanded: boolean = false;

    @action.bound public setExpanded(expanded: boolean) {
        this.expanded = expanded;
    }

    @action.bound public toggleExpanded() {
        this.expanded = !this.expanded;
    }

    @action.bound public setProgress(progress: number) {
        if (progress > 1) {
            progress = 1;
        }
        if (progress < 0) {
            progress = 0;
        }
        this.percentReady = progress;
    }

}

export default TorrentPackage;