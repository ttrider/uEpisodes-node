import { getTokens, normalizeName } from "./common";
import { getDefaultSettings, SettingsData } from "./default-settings";
import { FileMetadata } from "./types";

export function parse(
  fileParts: string[] | string,
  settings: SettingsData = getDefaultSettings()
) {
  fileParts = Array.isArray(fileParts) ? fileParts : fileParts.split("/");

  const ret: FileMetadata = {
    showName: [],
    season: [],
    episode: [],
    episodeAlt: [],
    showTokens: [],
  };

  const titleSet = new Map<string, string>();
  const seasonIndexSet = new Set<number>();
  const episodeIndexSet = new Set<number>();
  const episodeIndexAltSet = new Set<number>();

  const nameParsers = settings.nameParsers;

  const nameIndex = fileParts.length - 1;
  for (let index = nameIndex; index >= 0; index--) {
    let fileName = (fileParts[index] ?? "").replace(/\./gi, " ");
    for (const ignorePattern of settings.ignorePatterns) {
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
    ret.showName = Array.from(titleSet.values()).sort((a, b) =>
      a.length > b.length ? -1 : 1
    );
  }
  if (seasonIndexSet.size > 0) {
    ret.season = Array.from(seasonIndexSet);
  }
  if (episodeIndexSet.size > 0) {
    ret.episode = Array.from(episodeIndexSet);
  }

  if (episodeIndexAltSet.size > 0) {
    ret.episodeAlt = Array.from(episodeIndexAltSet);
  }

  ret.signature = ret.showName.join("-").toLowerCase().replace(/\s/gim, "-");

  ret.showTokens = ret.showName.map((t) => getTokens(t));

  return ret;

  function addShowName(showName: string) {
    if (showName) {
      const cleanshowName = normalizeName(showName);
      titleSet.set(cleanshowName, cleanshowName);
    }
  }
}
