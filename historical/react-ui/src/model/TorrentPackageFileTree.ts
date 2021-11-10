import TorrentPackage from './TorrentPackage';
import TorrentPackageFile from './TorrentPackageFile';
import TorrentPackageFolder from './TorrentPackageFolder';
import TorrentPackageItem from './TorrentPackageItem';


interface ITreeItem {
    files: TorrentPackageFile[],
    folders: { [name: string]: ITreeItem },
    name: string,
    path: string
}

class TorrentPackageFileTree implements ITreeItem {

    public files: TorrentPackageFile[] = [];
    public folders: { [name: string]: ITreeItem } = {};
    public name: string = "";
    public path: string = "";


    public add(file: TorrentPackageFile) {
        const parts = file.path.split("/");

        let current: ITreeItem = this;
        while (parts.length > 1) {
            const part = parts.shift();
            if (part) {
                let folder = current.folders[part];
                if (!folder) {
                    folder = {
                        files: [],
                        folders: {},
                        name: part,
                        path: parts.join("/")
                    };
                    current.folders[part] = folder;
                }
                current = folder;
            }

        }
        current.files.push(file);
    }

    public getItems(owner: TorrentPackage) {
        return this.getTreeItems(owner, this);
    }

    private getTreeItems(owner: TorrentPackage, treeItem: ITreeItem) {

        const folders: TorrentPackageItem[] = [];

        for (const folderName of Object.keys(treeItem.folders).sort()) {
            const folderItem = treeItem.folders[folderName];

            const items = this.getTreeItems(owner, folderItem);

            const folder = new TorrentPackageFolder(owner, folderItem.name, folderItem.path, items);

            folders.push(folder);
        }

        return folders.concat(treeItem.files.sort((a, b) => a.name < b.name ? -1 : 1));
    }
}

export default TorrentPackageFileTree;