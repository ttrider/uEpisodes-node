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
import { existsSync } from "fs";
import { remote } from "electron";
import _ from "lodash";
import { getDefaultSettings, SettingsData } from "uepisodes-modules";

export type FileTypes = "video" | "image" | "caption" | "other";

export interface SettingsState {
  data: SettingsData;
  fileTypes: {
    [name: string]: FileTypes;
  };
}
@Module({ dynamic: true, store, name: "settings", namespaced: true })
class Settings extends VuexModule implements SettingsState {
  data: SettingsData = getDefaultSettings();
  fileTypes: {
    [name: string]: FileTypes;
  } = {};

  @Mutation settingsFile(settingsFile: SettingsData) {
    // parse it here
    let fileTypes: {
      [name: string]: FileTypes;
    } = {};

    for (const typeItem of ["other", "image", "caption", "video"]) {
      const ti = typeItem as FileTypes;
      fileTypes = parseFileTypesString(settingsFile.fileTypes?.[ti]).reduce<{
        [name: string]: FileTypes;
      }>((data, item) => {
        data[item] = ti;
        return data;
      }, fileTypes);
    }
    this.fileTypes = fileTypes;

    this.data = settingsFile;
  }

  @Mutation addFileType(data: { ext: string; type: FileTypes }) {
    if (this.fileTypes[data.ext] != data.type) {
      this.fileTypes[data.ext] = data.type;
      store.dispatch("settings/saveFile");
    }
  }

  @Action({ commit: "settingsFile" })
  async initialize() {
    const settingsPath = path.resolve(
      remote.app.getPath("home"),
      ".uepisodes.json"
    );

    let data = getDefaultSettings();

    if (existsSync(settingsPath)) {
      const fb = await fs.readFile(settingsPath);
      if (fb) {
        const fbs = fb.toString();
        data = _.merge(data, JSON.parse(fbs));
      }
    }
    store.commit("settings/settingsFile", data);
    return data;
  }

  @Action({})
  async saveFile() {
    const settingsPath = path.resolve(
      remote.app.getPath("home"),
      ".uepisodes.json"
    );

    // process fileTypes
    const typeSets: { [id: string]: string[] } = {
      video: [],
      image: [],
      caption: [],
      other: [],
    };
    for (const ext in this.fileTypes) {
      if (Object.prototype.hasOwnProperty.call(this.fileTypes, ext)) {
        const fileType = this.fileTypes[ext];
        typeSets[fileType].push(ext);
      }
    }
    const data = { ...this.data };
    data.fileTypes = {
      video: typeSets.video.join(", "),
      image: typeSets.image.join(", "),
      caption: typeSets.caption.join(", "),
      other: typeSets.other.join(", "),
    };

    await fs.writeFile(settingsPath, JSON.stringify(data, null, 2));
  }
}

function parseFileTypesString(input?: string) {
  return (input ?? "")
    .split(/[,\s]+/g)
    .filter((i) => !!i)
    .map((i) => i.trim());
}

export const SettingsModule = getModule(Settings, store);
