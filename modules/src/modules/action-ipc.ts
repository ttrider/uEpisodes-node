import { ActionItemState, ActionManagerAction } from "./action-common";


export type IpcInvoke = { invoke(channel: string, ...args: any[]): Promise<any> };
export type IpcHandle = { handle(channel: string, listener: (...args: any[]) => (Promise<void>) | (any)): void };
export type IpcSend = { send(channel: string, ...args: any[]): void };
export type IpcOn = { on(channel: string, listener: (...args: any[]) => void): void };


export function ipcEnqueue(ipc: IpcInvoke, actions: ActionManagerAction[]) {
  ipc.invoke("action-manager:enqueue", actions);
}

export function ipcOnEnqueue(ipc: IpcHandle, handler: (actions: ActionManagerAction[]) => void) {
  ipc.handle("action-manager:enqueue", (_e, actions) => handler(actions));
}


export function ipcStateUpdate(ipc: IpcSend, actions: ActionItemState[]) {
  ipc.send("action-manager:state-update", actions);
}

export function ipcOnStateUpdate(ipc: IpcOn, handler: (actions: ActionItemState[]) => void) {
  ipc.on("action-manager:state-update", (_e, actions) => handler(actions));
}