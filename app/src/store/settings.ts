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
import { existsSync } from "fs";
import { remote } from "electron";
import _ from "lodash";
import { getDefaultSettings, SettingsData } from "uepisodes-modules";

const fs = fss.promises;

export type FileTypes = "video" | "image" | "caption" | "other";

export interface SettingsState {
  data: SettingsData;
  fileTypes: {
    [name: string]: FileTypes;
  };
  sampleFolderNames: string[];

  showVideoOnly: boolean;
}
@Module({ dynamic: true, store, name: "settings", namespaced: true })
class Settings extends VuexModule implements SettingsState {
  data: SettingsData = getDefaultSettings();
  get fileTypes() {
    return this.data.fileTypes;
  }
  get sampleFolderNames() {
    return this.data.sampleFolderNames;
  }
  get showVideoOnly() {
    return this.data.presentation.videoOnly;
  }

  @Mutation updateShowVideoOnly(value: boolean) {
    this.data.presentation.videoOnly = value;
    store.dispatch("settings/saveFile");
  }

  @Mutation settingsFile(settingsFile: SettingsData) {
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

    const defaultData = getDefaultSettings();

    if (existsSync(settingsPath)) {
      const fb = await fs.readFile(settingsPath);
      if (fb) {
        const fbs = fb.toString();
        const newData = JSON.parse(fbs);
        const data = _.merge({}, defaultData, newData);
        store.commit("settings/settingsFile", data);
        return data;
      }
    }
    store.commit("settings/settingsFile", defaultData);
    return defaultData;
  }

  @Action({})
  async saveFile() {
    const settingsPath = path.resolve(
      remote.app.getPath("home"),
      ".uepisodes.json"
    );

    await fs.writeFile(settingsPath, JSON.stringify(this.data, null, 2));
  }
}

function parseFileTypesString(input?: string) {
  return (input ?? "")
    .split(/[,\s]+/g)
    .filter((i) => !!i)
    .map((i) => i.trim());
}

export const SettingsModule = getModule(Settings, store);
