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
  detection: {
    videoExtensions: string;
    captionExtnsions: string;
  };
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
  data: SettingsData = getDefaultSettings();

  @Mutation settingsFile(settingsFile: SettingsData) {
    this.data = settingsFile;
  }

  @Action({ commit: "settingsFile" })
  initialize() {
    const settingsPath = path.resolve(
      remote.app.getPath("home"),
      ".uepisodes.json"
    );

    let data = getDefaultSettings();

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

  let data = getDefaultSettings();

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

function getDefaultSettings() {
  const defaultSettings: SettingsData = {
    version: 1,
    detection: {
      videoExtensions:
        ".3g2, .amv, .asf, .avi, .drc, .f4a, .f4b, .f4p, .f4v, .flv, .M2TS, .m2v, .m4p, .m4v, .mkv, .mng, .mov, .mp2, .mp4, .mpe, .mpeg, .mpg, .mpv, .MTS, .mxf, .nsv, .ogg, .ogv, .qt, .rm, .rmvb, .roq, .svi, .viv, .vob, .webm, .wmv, .yuv, ",
      captionExtnsions: "",
    },
  };
  return defaultSettings;
}
