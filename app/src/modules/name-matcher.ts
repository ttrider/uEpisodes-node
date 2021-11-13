import { SettingsModule } from "@/store/settings";

export interface EpisodeMetadata {
  showName?: string;
  season?: number;
  episode?: number;
}

export default function match(fileParts: string[]) {
  const ret: EpisodeMetadata = {};
  const fileName = fileParts.at(-1);

  if (fileName) {
    const nameParsers = SettingsModule.data.nameParsers;

    for (const pattern of nameParsers) {
      //if (!pattern.usePath) {
      const match = new RegExp(pattern.pattern, "i").exec(fileName);
      if (match) {
        if (pattern.titleIndex != undefined) {
          ret.showName = match[pattern.titleIndex];
        }
        if (pattern.seasonIndex != undefined) {
          const val = parseInt(match[pattern.seasonIndex]);
          if (!isNaN(val)) {
            ret.season = val;
          }
        }
        if (pattern.episodeIndex != undefined) {
          const val = parseInt(match[pattern.episodeIndex]);
          if (!isNaN(val)) {
            ret.episode = val;
          }
        }
        break;
      }
      //}
    }
    return ret;
  }
}
