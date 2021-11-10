import { action, computed, observable } from 'mobx';
import Agent from './Agent';
abstract class Client implements ISidebarItem {

    //#region ISidebarItem
    @observable public section?: ISidebarSection | undefined;
    @computed public get subTitle() {
        return this.name;
    }
    @computed public get title() {
        if (this.agent && this.agent.title) {
            return this.agent.title;
        }
        return "";
    }
    @observable public selected: boolean;
    @observable public status: string;



    //#endregion ISidebarItem

    @observable public name: string;

    


    public abstract get viewType():ViewTypes;

    public agent: Agent;

    @action public select() {
        if (this.section && this.section.provider) {
            this.section.provider.selectItem(this);
        }
        return this;
    }



    

}

export default Client;