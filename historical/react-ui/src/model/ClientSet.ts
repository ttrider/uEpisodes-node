import { observable } from 'mobx';
import Application from './Application';

export abstract class ClientSet implements ISidebarSection {


    @observable public provider?: Application;
    @observable public title: string;
    public abstract items: ISidebarItem[];
    @observable public commandName?: string;
    @observable public commandHandler?: (() => void);


    constructor(application: Application, name: string, commandName: string, commandHandler: (() => void)) {
        this.provider = application;
        this.title = name;
        this.commandName = commandName;
        this.commandHandler = commandHandler;
    }

}

export default ClientSet;