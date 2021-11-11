import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
import path from "path";
import fs from "fs/promises";

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

  @Action({ commit: "addWorkItems" })
  async addFiles(files: string[]) {
    const workItems: FileSystemItem[] = [];
    for (const file of files) {
      await processIncomingFiles(file, workItems);
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
    fileItems.push(newItem);
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
  workItems: FileSystemItem[]
) {
  try {
    const fileStat = await fs.stat(filePath);

    if (fileStat.isFile()) {
      const fi = new FileSystemItem({
        filePath,
        mode: "file",
        size: fileStat.size,
      });
      workItems.push(fi);
      return;
    }
    if (fileStat.isDirectory()) {
      const files = await fs.readdir(filePath);
      for (const file of files) {
        await processIncomingFiles(path.resolve(filePath, file), workItems);
      }
    }
  } catch (e) {
    workItems.push(
      new FileSystemItem({
        filePath: filePath,
        mode: "unknown",
        error: (e as Error)?.message ?? "error",
      })
    );
  }
}

export class FileSystemItem {
  filePath: string;
  error?: string;
  size: number;
  mode: "file" | "folder" | "unknown";
  children: FileSystemItem[] = [];

  expanded = true;

  constructor(params: {
    filePath: string;
    mode: "file" | "folder" | "unknown";
    size?: number;
    error?: string;
  }) {
    this.filePath = params.filePath;
    this.error = params.error;
    this.size = params.size ?? 0;
    this.mode = params.mode;
  }

  get pathParts() {
    return this.filePath.split(path.sep);
  }

  get title() {
    return this.name ? this.name : "FileSystem";
  }
  get name() {
    return this.pathParts.at(-1) ?? "";
  }
  get id() {
    return this.filePath;
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
    mode: "unknown",
  });
  get id() {
    return "";
  }
  get title() {
    return "";
  }
}

export const WorksetModule = getModule(Workset, store);
