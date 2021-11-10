import { action, observable } from 'mobx';
import Application from './Application';
import Client from './Client';


class Agent {


    public app?: Application;

    @observable public title: string;

    @observable public clients: Client[] = [];


    @action public addClient(...clients: Client[]) {

        for (const client of clients) {
            if (client) {
                client.agent = this;
                this.clients.push(client);
            }
        }
        return this;
    }

}
export default Agent;