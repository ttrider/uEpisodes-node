import { action, computed, observable } from 'mobx';
import Application from './Application';
import { ClientSet } from './ClientSet';
import FolderWatcherClient from './FolderWatcherClient';

class FolderWatcherClientSet extends ClientSet implements ISidebarSection {

    @computed.struct
    public get items(): ISidebarItem[] {
        const items: ISidebarItem[] = [];
        if (this.provider && this.provider.agents) {
            for (const agent of this.provider.agents) {
                for (const client of agent.clients) {
                    if (client instanceof FolderWatcherClient) {
                        client.section = this;
                        items.push(client);
                    }
                }
            }
        }
        return observable(items);
    }
    constructor(application: Application) {
        super(application, "Monitor Folders", "add folder", () => { this.addFolder(); });
    }

    @action public addFolder() {
        // tslint:disable-next-line:no-console
        console.info("addFolder");
    }
}

export default FolderWatcherClientSet;
