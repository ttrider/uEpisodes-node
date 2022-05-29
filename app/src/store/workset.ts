import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "../store";
import path from "path";
import fss from "fs";
import { FileSystemItem } from "../model/file-item";
import Vue from "vue";
import { SettingsModule } from "./settings";
import { ActionManagerClient } from "uepisodes-modules";
import { ActionManagerAction } from "uepisodes-modules/dist/modules/action-common";

const fs = fss.promises;

const actionClient = new ActionManagerClient();

export interface WorksetState {
  fileItems: FileSystemItem[];
}

@Module({ dynamic: true, store, name: "workset", namespaced: true })
class Workset extends VuexModule implements WorksetState {
  fileItems: FileSystemItem[] = [];

  @Mutation addWorkItems(workItems: FileSystemItem[]) {
    // merge-in new items
    for (const newWorkItem of workItems) {
      mergeInFileItem(this.fileItems, newWorkItem, 0);
    }
  }

  @Mutation removeFileItem(id: string) {
    const targetPath = lookupFileItemStack(this.fileItems, id);
    if (targetPath) {
      if (targetPath.length === 1) {
        this.fileItems = [];
      } else {
        const parent = targetPath[targetPath.length - 2];
        if (parent) {
          const target = parent.children.findIndex((i) => i.id == id);
          if (target != -1) {
            parent.children.splice(target, 1);
          }
        }
      }
    }
  }

  @Action({ commit: "addWorkItems" })
  async addFiles(files: string[]) {
    const workItems: FileSystemItem[] = [];
    for (const file of files) {
      await processIncomingFiles(file, undefined, workItems);
    }
    return workItems;
  }

  @Action({ commit: "addWorkItems" })
  async scheduleActions(fileItemPath: string, autoRun: boolean) {

    const fileSystemItem = lookupFileItem(this.fileItems, fileItemPath);
    if (fileSystemItem && fileSystemItem.status === "ready") {
      if (fileSystemItem.actions.length === 0){
        // no actions registered yet
        // let's create some

        const renameAction = SettingsModule.data.renameAction
        ? ({
          id: fileItemPath+":"SettingsModule.data.renameAction
        } as ActionManagerAction)
        : undefined;

      actions.push(renameAction);

      const copyActions = SettingsModule.data.copyActions.map(
        (ap) => new CopyActionItem(this, ap, renameAction)
      );
      actions.push(...copyActions);

      const moveAction = SettingsModule.data.moveAction
        ? new MoveActionItem(
          this,
          SettingsModule.data.moveAction,
          renameAction,
          ...copyActions
        )
        : undefined;

      actions.push(moveAction);



      }

      actionClient.enqueueActions()









    }


    // const workItems: FileSystemItem[] = [];
    // for (const file of files) {
    //   await processIncomingFiles(file, undefined, workItems);
    // }
    return workItems;
  }

}


function lookupFileItem(
  fileItems: FileSystemItem[],
  filePath: string
): FileSystemItem | undefined {

  const stack = lookupFileItemStack(fileItems, filePath);

  if (stack && stack.length > 1) {
    return stack[stack.length - 1];
  }
  return undefined;
}

function lookupFileItemStack(
  fileItems: FileSystemItem[],
  itemParts: string[] | string
): FileSystemItem[] | undefined {

  itemParts = Array.isArray(itemParts) ? itemParts : itemParts.split(path.sep);

  const id = itemParts.shift();
  const fi = fileItems.find((i) => i.name === id);
  if (fi) {
    if (itemParts.length === 0) {
      // found it!
      return [fi];
    }
    const ret = lookupFileItemStack(fi.children, itemParts);
    if (ret) {
      ret.unshift(fi);
      return ret;
    }
  }
  return undefined;
}

function mergeInFileItem(
  fileItems: FileSystemItem[],
  newItem: FileSystemItem,
  level: number
) {
  const lastLevel = newItem.pathParts.length === level + 1;
  const part = newItem.pathParts[level];

  for (const item of fileItems) {
    if (item.name === part) {
      if (item.id === newItem.id) {
        return;
      }
      mergeInFileItem(item.children, newItem, level + 1);
      return;
    }
  }

  // not found
  if (lastLevel) {
    // just add file item
    const newItemObservable = Vue.observable(newItem);
    fileItems.push(newItemObservable);
    // begin initialization - don't wait on it
    newItemObservable.initialize();
  } else {
    // let's make a folder
    // let's check if this is a 'samples' folder

    const partlc = part.toLowerCase();
    const sampleIndex = SettingsModule.sampleFolderNames.findIndex(
      (f) => f === partlc
    );
    if (sampleIndex === -1) {
      const folder = new FileSystemItem({
        filePath: newItem.pathParts.slice(0, level + 1).join(path.sep),
        mode: "folder",
      });
      fileItems.push(folder);
      mergeInFileItem(folder.children, newItem, level + 1);
    }
  }
}

async function processIncomingFiles(
  filePath: string,
  basePath: string | undefined,
  workItems: FileSystemItem[]
) {
  try {
    const fileStat = await fs.stat(filePath);

    if (fileStat.isFile()) {
      const fi = new FileSystemItem({
        filePath,
        basePath,
        mode: "other",
        size: fileStat.size,
      });
      workItems.push(fi);
      return;
    }

    if (fileStat.isDirectory()) {
      const files = await fs.readdir(filePath);

      if (!basePath) {
        basePath = filePath;
      }

      for (const file of files) {
        await processIncomingFiles(
          path.resolve(filePath, file),
          basePath,
          workItems
        );
      }
    }
  } catch (e) {
    workItems.push(
      new FileSystemItem({
        filePath: filePath,
        mode: "other",
        error: (e as Error)?.message ?? "error",
      })
    );
  }
}

export interface WorkItem {
  id: string;
  title: string;
  fileItem: FileSystemItem;
}

export class FileWorkItem implements WorkItem {
  constructor(public fileItem: FileSystemItem) { }
  get id() {
    return this.fileItem.filePath;
  }
  get title() {
    return this.fileItem.filePath;
  }
}

export class FolderWorkItem implements WorkItem {
  constructor(public fileItem: FileSystemItem) { }
  get id() {
    return this.fileItem.filePath;
  }
  get title() {
    return this.fileItem.filePath;
  }
}

export class TorrentWorkItem implements WorkItem {
  fileItem: FileSystemItem = new FileSystemItem({
    filePath: "torrent",
    mode: "other",
  });
  get id() {
    return "";
  }
  get title() {
    return "";
  }
}

export const WorksetModule = getModule(Workset, store);
