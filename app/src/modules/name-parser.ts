import { SettingsModule } from "../store/settings";

export interface FileMetadata {
  showName?: string | string[];
  season?: number | number[];
  episode?: number | number[];
  episodeAlt?: number | number[];
}

export function parse(fileParts: string[]) {
  const ret: FileMetadata = {};

  const titleSet = new Map<string, string>();
  const seasonIndexSet = new Set<number>();
  const episodeIndexSet = new Set<number>();
  const episodeIndexAltSet = new Set<number>();

  const nameParsers = SettingsModule.data.nameParsers;

  const nameIndex = fileParts.length - 1;
  for (let index = nameIndex; index >= 0; index--) {
    let fileName = (fileParts[index] ?? "").replace(/\./gi, " ");
    for (const ignorePattern of SettingsModule.data.ignorePatterns) {
      fileName = fileName.replace(new RegExp(ignorePattern, "gim"), " ");
    }

    if (fileName) {
      let matched = false;
      for (const pattern of nameParsers) {
        const match = new RegExp(pattern.pattern, "i").exec(fileName);
        if (match) {
          if (pattern.titleIndex != undefined) {
            const showName = match[pattern.titleIndex];
            addShowName(showName);
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
            }
          }
          if (pattern.episodeIndexAlt != undefined) {
            const val = parseInt(match[pattern.episodeIndexAlt]);
            if (!isNaN(val)) {
              episodeIndexAltSet.add(val);
            }
          }
          matched = true;
          break;
        }
      }
      if (!matched) {
        if (index != nameIndex) {
          addShowName(fileName);
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

  if (episodeIndexAltSet.size > 0) {
    const episodeIndexAltValues = Array.from(episodeIndexAltSet);
    ret.episodeAlt =
      episodeIndexAltValues.length === 1
        ? episodeIndexAltValues[0]
        : episodeIndexAltValues;
  }

  return ret;

  function addShowName(showName: string) {
    if (showName) {
      const cleanshowName = showName
        .replace(/[_\-.'()]+/gm, " ")
        .replace(/\s{2,}/gm, " ")
        .trim();
      titleSet.set(cleanshowName.toLowerCase(), cleanshowName);
    }
  }
}
