import { ActionManagerAction, ActionPattern, EpisodeFileItem } from "./action-common";
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


  scheduleActions(
    fileItem: EpisodeFileItem,
    renameActionPattern: ActionPattern | undefined,
    copyActionsPattern: ActionPattern[],
    moveActionPattern: ActionPattern | undefined) {

    let actionSet: ActionManagerAction[] = [];

    if (renameActionPattern) {
      const renameAction: ActionManagerAction = {
        id: generateActionId(fileItem),
        type: "rename",
        source: fileItem.filePath,
        target: resolveActionPattern(fileItem, renameActionPattern),
        dependsOn: []
      };
      actionSet.push(renameAction);
    }

    actionSet = copyActionsPattern.reduce((actions, pattern) => {
      actions.push(

        {
          id: generateActionId(fileItem),
          type: "copy",
          source: fileItem.filePath,
          target: resolveActionPattern(fileItem, pattern),
          dependsOn: actionSet.map(a => a.id)
        });

      return actions;
    }, actionSet);

    if (moveActionPattern) {
      actionSet.push({
        id: generateActionId(fileItem),
        type: "move",
        source: fileItem.filePath,
        target: resolveActionPattern(fileItem, moveActionPattern),
        dependsOn: actionSet.map(a => a.id)
      });
    }
    this.enqueueActions(actionSet);

    return actionSet;
  }
}


function generateActionId(fileItem: EpisodeFileItem) {
  return fileItem.filePath + `:${Date.now()}${Math.round(Math.random() * 1000)}`;
}

function resolveActionPattern(fileItem: EpisodeFileItem, action: ActionPattern) {

  const resultPath =
    action.pattern
      .replace(/{{show}}/gim, fileItem.showName ?? "")
      .replace(/{{season}}/gim, formatNumber(fileItem.season))
      .replace(/{{episode}}/gim, formatNumber(fileItem.episode, fileItem.episodeAlt))
      .replace(/{{title}}/gim, formatTitle(fileItem.episodeName, fileItem.episodeNameAlt))
    ;

  return resultPath;

  function formatNumber(value: number | null, valueAlt?: number | null) {

    if (!value) {
      return "00";
    }
    return value
      .toString().padStart(2, "0")
      + (valueAlt ? valueAlt.toString().padStart(2, "0") : "");
  }

  function formatTitle(value: string | null, valueAlt?: string | null) {

    if (!value) {
      return valueAlt ? valueAlt : "";
    }
    return value + (valueAlt ? " - " + valueAlt : "");
  }

}
