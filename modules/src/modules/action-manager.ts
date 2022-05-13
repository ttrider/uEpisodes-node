import { ActionItemState, ActionManagerAction } from "./action-common";
import { IpcHandle, ipcOnEnqueue, IpcSend, ipcStateUpdate } from "./action-ipc";
import { ActionItem, ActionItemOwner, NoneActionItem } from "./action-item";
import { RenameActionItem, MoveActionItem, CopyActionItem, CleanupActionItem } from "./action-item-fs";

const actionFactory = {
  "rename": RenameActionItem.create,
  "move": MoveActionItem.create,
  "copy": CopyActionItem.create,
  "cleanup": CleanupActionItem.create,
  "none": NoneActionItem.create,
}

export type ActionType = keyof typeof actionFactory;

export function createAction(owner: ActionItemOwner, params: ActionManagerAction): ActionItem {

  const factory = actionFactory[params.type] ?? actionFactory["none"];

  return factory(owner, params);
}

export class ActionManager implements ActionItemOwner {

  ipcMain: IpcHandle;
  listeners: IpcSend[] = [];
  actionItems: Record<string, ActionItem> = {};

  constructor(ipcMain: IpcHandle) {
    this.ipcMain = ipcMain;

    ipcOnEnqueue(this.ipcMain, (actions) => this.enqueueActions(actions));
  }
  onStateChanged(state: ActionItemState) {
    for (const listener of this.listeners) {
      ipcStateUpdate(listener, [state]);
    }
  }

  enqueueActions(
    actions: ActionManagerAction[]
  ) {

    const actionItemSet = actions.map(a => (
      {
        id: a.id,
        actionItem: createAction(this, a),
        dependsOn: a.dependsOn
      })
    );

    if (actionItemSet.length !== 0) {

      // adding items
      for (const item of actionItemSet) {
        if (!this.actionItems[item.id]) {
          this.actionItems[item.id] = item.actionItem;
        }
      }

      // adding dependencies
      for (const item of actionItemSet) {
        item.actionItem.dependsOnAction(...
          item.dependsOn
            .map(id => this.actionItems[id])
            .filter(item => !!item) as ActionItem[]
        );
      }

      // run items
      for (const item of actionItemSet) {
        this.actionItems[item.id].run();
      }
    }
  }

  addClientListener(listener: IpcSend) {
    const index = this.listeners.findIndex(item => item === listener);
    if (index === -1) {
      this.listeners.push(listener);
    }
    return this;
  }
  removeClientListener(listener: IpcSend) {
    const index = this.listeners.findIndex(item => item === listener);
    if (index !== -1) {
      this.listeners.splice(index, 1);
    }
    return this;
  }

  dispose() {
    this.listeners = [];
  }

}