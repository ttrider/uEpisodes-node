import { action, computed, observable } from 'mobx';
import Application from './Application';
import { ClientSet } from './ClientSet';
import FileSystemClient from './FileSystemClient';

class FileSystemClientSet extends ClientSet implements ISidebarSection {

    @computed.struct
    public get items(): ISidebarItem[] {
        const items: ISidebarItem[] = [];
        if (this.provider && this.provider.agents) {
            for (const agent of this.provider.agents) {
                for (const client of agent.clients) {
                    if (client instanceof FileSystemClient) {
                        client.section = this;
                        items.push(client);
                    }
                }
            }
        }
        return observable(items);
    }
    constructor(application: Application) {
        super(application, "Files and Folders", "open", () => { this.openFile(); });
    }
    @action public openFile() {
        // tslint:disable-next-line:no-console
        console.info("openFile");
    }
}

export default FileSystemClientSet;
