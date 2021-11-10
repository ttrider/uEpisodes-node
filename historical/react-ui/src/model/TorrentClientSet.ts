import { action, computed, observable } from 'mobx';
import Application from './Application';
import { ClientSet } from './ClientSet';
import TorrentClient from './TorrentClient';

class TorrentClientSet extends ClientSet implements ISidebarSection {

    @computed.struct
    public get items(): ISidebarItem[] {
        const items: ISidebarItem[] = [];
        if (this.provider && this.provider.agents) {
            for (const agent of this.provider.agents) {
                for (const client of agent.clients) {
                    if (client instanceof TorrentClient) {
                        client.section = this;
                        items.push(client);
                    }
                }
            }
        }
        return observable(items);
    }
    constructor(application: Application) {
        super(application, "Torrent", "connect", () => { this.connectTorrent(); });
    }

    @action public connectTorrent() {
        // tslint:disable-next-line:no-console
        console.info("connectTorrent");
    }
}

export default TorrentClientSet;
