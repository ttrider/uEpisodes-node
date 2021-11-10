import Client from './Client';

import { observable } from 'mobx';
import t01 from "../examples/t01";
import t02 from "../examples/t02";
import t03 from "../examples/t03";
import t04 from "../examples/t04";
import t05 from "../examples/t05";
import t06 from "../examples/t06";
import TorrentPackage from './TorrentPackage';
import TorrentPackageFile from './TorrentPackageFile';




class TorrentClient extends Client {
    public viewType: ViewTypes = "TorrentClientView";

    @observable public packages: TorrentPackage[] = [];


    constructor() {
        super();

        this.loadExample(t01);
        this.loadExample(t02);
        this.loadExample(t03);
        this.loadExample(t04);
        this.loadExample(t05);
        this.loadExample(t06);

        // let index = 0;
        // setInterval(() => {

        //     const pack = this.packages[index];
        //     if (pack.percentReady < 1) {
        //         pack.setProgress(pack.percentReady + 0.01);
        //     }

        //     index = (index += 2) % 6;

        // }, 250);

    }

    protected loadExample(ti: TorrentInfo) {
        const pack = new TorrentPackage();
        pack.name = ti.name;
        pack.percentReady = ti.percent;
        pack.status = ti.status;

        for (const fl of ti.files) {
            const pf = new TorrentPackageFile(pack, fl.name, fl.path, fl.length, ti.status, fl.percent);
            pack.files.push(pf);
        }

        this.packages.push(pack);
    }
}

export default TorrentClient;