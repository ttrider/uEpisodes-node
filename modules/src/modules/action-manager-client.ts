import { ActionManagerAction } from "./action-common";
import { IpcOn, IpcInvoke, ipcOnStateUpdate, ipcEnqueue } from "./action-ipc";

export class ActionManagerClient {
  ipcRenderer: IpcOn & IpcInvoke;

  constructor() {
    this.ipcRenderer = (window as any).ipcRenderer;
    ipcOnStateUpdate(this.ipcRenderer, (actions) => {
      console.info("ActionManagerClient", actions);
    })
  }

  enqueueActions(actions: ActionManagerAction[]) {
    ipcEnqueue(this.ipcRenderer, actions);
  }
}