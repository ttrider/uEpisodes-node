import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "../store";
import path from "path";
import fs from "fs/promises";
import { FileSystemItem } from "../model/file-item";
import Vue from "vue";

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
    const target = this.fileItems.findIndex((i) => i.id == id);
    if (target != -1) {
      this.fileItems.splice(target, 1);
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
    const folder = new FileSystemItem({
      filePath: newItem.pathParts.slice(0, level + 1).join(path.sep),
      mode: "folder",
    });
    fileItems.push(folder);
    mergeInFileItem(folder.children, newItem, level + 1);
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
  constructor(public fileItem: FileSystemItem) {}
  get id() {
    return this.fileItem.filePath;
  }
  get title() {
    return this.fileItem.filePath;
  }
}

export class FolderWorkItem implements WorkItem {
  constructor(public fileItem: FileSystemItem) {}
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
