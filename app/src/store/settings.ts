import {
  Action,
  getModule,
  Module,
  Mutation,
  VuexModule,
} from "vuex-module-decorators";
import store from "@/store";
//import os from "os";
import path from "path";
import fs from "fs";
import { remote } from "electron";

export interface SettingsState {
  data: SettingsData;
}

export interface SettingsData {
  version: number;
  torrentClient?: {
    url: string;
    user: string;
    pwd?: string;
    enabled?: boolean;
    enableCopy?: boolean;
    enableMove?: boolean;
    stopSeeding?: boolean;
  };
}

@Module({ dynamic: true, store, name: "settings", namespaced: true })
class Settings extends VuexModule implements SettingsState {
  data: SettingsData = { version: -1 };

  @Mutation settingsFile(settingsFile: SettingsData) {
    this.data = settingsFile;
  }

  @Action({ commit: "settingsFile" })
  initialize() {
    const settingsPath = path.resolve(
      remote.app.getPath("home"),
      ".uepisodes.json"
    );

    let data = {
      version: 1,
    };

    if (fs.existsSync(settingsPath)) {
      const fb = fs.readFileSync(settingsPath);
      if (fb) {
        const fbs = fb.toString();
        data = JSON.parse(fbs);
      }
    }
    store.commit("settings/settingsFile", data);
    return data;
  }
}

export const SettingsModule = getModule(Settings, store);

export function initialize() {
  const settingsPath = path.resolve(
    remote.app.getPath("home"),
    ".uepisodes.json"
  );

  let data = {
    version: 1,
  };

  if (fs.existsSync(settingsPath)) {
    const fb = fs.readFileSync(settingsPath);
    if (fb) {
      const fbs = fb.toString();
      data = JSON.parse(fbs);
    }
  }
  store.commit("settings/settingsFile", data);
  return data;
}
