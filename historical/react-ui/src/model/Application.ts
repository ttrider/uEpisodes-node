import { action, computed, observable } from 'mobx';
import Agent from './Agent';
import ClientSet from './ClientSet';
import FileSystemClientSet from './FileSystemClientSet';
import FolderWatcherClientSet from './FolderWatcherClientSet';
import TorrentClientSet from './TorrentClientSet';

class Application implements ISidebarProvider {

    //#region ISidebarProvider
    @computed.struct public get sidebarSections(): ISidebarSection[] {
        return this.clientSets;
    }
    //#endregion

    @observable public agents: Agent[] = [];

    private clientSets: ClientSet[] = [];

    constructor() {
        this.clientSets = [
            new TorrentClientSet(this),
            new FolderWatcherClientSet(this),
            new FileSystemClientSet(this),
        ];
    }

    @action public selectItem(item?: ISidebarItem) {

        if (item) {
            for (const section of this.sidebarSections) {
                for (const sectionItem of section.items) {
                    if (item !== sectionItem) {
                        if (sectionItem.selected) {
                            sectionItem.selected = false;
                        }
                    }
                }
            }
            item.selected = true;
        } else {
            // select the first item
            for (const section of this.sidebarSections) {
                for (const sectionItem of section.items) {
                    sectionItem.selected = true;
                    return this;
                }
            }
        }
        return this;
    }

    @computed get selectedItem() {

        for (const section of this.sidebarSections) {
            for (const item of section.items) {
                if (item.selected) {
                    return item;
                }
            }
        }
        return;
    }

    @action public addAgent(...agents: Agent[]) {

        for (const agent of agents) {
            if (agent) {
                agent.app = this;
                this.agents.push(agent);
            }
        }
        return this;
    }



}

export default Application;