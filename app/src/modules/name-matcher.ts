import { SettingsModule } from "../store/settings";
import _ from "lodash";

export interface EpisodeMetadata {
  showName?: string | string[];
  season?: number | number[];
  episode?: number | number[];
}

export default function match(fileParts: string[]) {
  const ret: EpisodeMetadata = {};

  const titleSet = new Map<string, string>();
  const seasonIndexSet = new Set<number>();
  const episodeIndexSet = new Set<number>();

  const nameParsers = SettingsModule.data.nameParsers;

  for (const fileName of [...fileParts].reverse()) {
    if (fileName) {
      for (const pattern of nameParsers) {
        const match = new RegExp(pattern.pattern, "i").exec(fileName);
        if (match) {
          if (pattern.titleIndex != undefined) {
            const showName = match[pattern.titleIndex];
            const cleanshowName = showName
              .replace(/[_\-.]+/gm, " ")
              .replace(/\s{2,}/gm, "")
              .trim();
            titleSet.set(cleanshowName.toLowerCase(), cleanshowName);
          }
          if (pattern.seasonIndex != undefined) {
            const val = parseInt(match[pattern.seasonIndex]);
            if (!isNaN(val)) {
              seasonIndexSet.add(val);
            }
          }
          if (pattern.episodeIndex != undefined) {
            const val = parseInt(match[pattern.episodeIndex]);
            if (!isNaN(val)) {
              episodeIndexSet.add(val);
              ret.episode = val;
            }
          }
          if (pattern.episodeIndexAlt != undefined) {
            const val = parseInt(match[pattern.episodeIndexAlt]);
            if (!isNaN(val)) {
              episodeIndexSet.add(val);
              ret.episode = val;
            }
          }
          break;
        }
      }
    }
  }

  if (titleSet.size > 0) {
    const titleKeys = Array.from(titleSet.keys());
    if (titleKeys.length === 1) {
      ret.showName = titleSet.get(titleKeys[0]);
    } else {
      ret.showName = Array.from(titleSet.values()).sort((a, b) =>
        a.length > b.length ? -1 : 1
      );
    }
  }
  if (seasonIndexSet.size > 0) {
    const seasonIndexValues = Array.from(seasonIndexSet);
    ret.season =
      seasonIndexValues.length === 1 ? seasonIndexValues[0] : seasonIndexValues;
  }
  if (episodeIndexSet.size > 0) {
    const episodeIndexValues = Array.from(episodeIndexSet);
    ret.episode =
      episodeIndexValues.length === 1
        ? episodeIndexValues[0]
        : episodeIndexValues;
  }

  return ret;
}
