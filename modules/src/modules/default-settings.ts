export interface SettingsData {
  version: number;
  presentation: {
    videoOnly: boolean;
  }
  sampleFolderNames: string[];
  fileTypes: {
    [name: string]: "video" | "caption" | "other" | "image"
  };

  ignorePatterns: string[];

  nameParsers: {
    pattern: string;
    titleIndex?: number;
    seasonIndex?: number;
    episodeIndex?: number;
    episodeIndexAlt?: number;
    usePath?: boolean;
  }[];

  knownSignatures: {
    [signature: string]: string;
  };

  renameAction?: {
    pattern: string;
  }

  moveAction?: {
    pattern: string;
  }
  copyActions: { pattern: string }[];

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

export function getDefaultSettings() {
  const defaultSettings: SettingsData = {
    version: 1,
    presentation: {
      videoOnly: false
    },

    sampleFolderNames: ["sample", "samples"],

    fileTypes: {
      ".3g2": "video",
      ".amv": "video",
      ".asf": "video",
      ".avi": "video",
      ".drc": "video",
      ".f4a": "video",
      ".f4b": "video",
      ".f4p": "video",
      ".f4v": "video",
      ".flv": "video",
      ".m2ts": "video",
      ".m2v": "video",
      ".m4p": "video",
      ".m4v": "video",
      ".mkv": "video",
      ".mng": "video",
      ".mov": "video",
      ".mp2": "video",
      ".mp4": "video",
      ".mpe": "video",
      ".mpeg": "video",
      ".mpg": "video",
      ".mpv": "video",
      ".mts": "video",
      ".mxf": "video",
      ".nsv": "video",
      ".ogg": "video",
      ".ogv": "video",
      ".qt": "video",
      ".rm": "video",
      ".rmvb": "video",
      ".roq": "video",
      ".svi": "video",
      ".viv": "video",
      ".vob": "video",
      ".webm": "video",
      ".wmv": "video",
      ".yuv,": "video",
      ".srt": "caption",
      ".scc": "caption",
      ".stl": "caption",
    },
    ignorePatterns: [
      "\\[\\swww\\storrenting\\scom\\s\\]",
      "\\[\\swww\\storrentday\\scom\\s\\]",
      "\\[\\swww\\sCpasBien\\sio\\s\\]",
    ],
    knownSignatures: {
      "under-dome-3-under-dome": "1",
    },
    nameParsers: [
      {
        pattern:
          "^((.*?)(?:[^\\w\\d]|_)*)?(s(\\d+)(?:[\\s.-]*)?e\\s?(\\d+))(-?e?(\\d+))?",
        titleIndex: 2,
        seasonIndex: 4,
        episodeIndex: 5,
        episodeIndexAlt: 7,
      },
      {
        pattern:
          "^((.*?)(?:[^\\w\\d]|_)*)?(season\\s+(\\d+))\\s*((episode\\s+(\\d+))-?(\\d+)?)?",
        titleIndex: 1,
        seasonIndex: 4,
        episodeIndex: 7,
        episodeIndexAlt: 8,
      },
      {
        pattern: "^((.*?)(?:[^\\w\\d]|_)*)?((\\d+)x(\\d+))(-?(\\d+))?",
        titleIndex: 2,
        seasonIndex: 4,
        episodeIndex: 5,
        episodeIndexAlt: 7,
      },
      {
        pattern:
          "^((.*?)(?:[^\\w\\d]|_)*)?(\\d?\\d)(\\d\\d)(?:[^\\w\\d]|_)+(\\d\\d)?",
        titleIndex: 2,
        seasonIndex: 3,
        episodeIndex: 4,
        episodeIndexAlt: 5,
      },
      {
        pattern: "^((.*?)(?:[^\\w\\d]|_)*)?s(\\d+)",
        titleIndex: 2,
        seasonIndex: 3,
      },
      {
        pattern: "^((.*?)(?:[^\\w\\d]|_)*)?ep?(\\d+)",
        titleIndex: 2,
        episodeIndex: 3,
      },
      {
        pattern: "^(ep?(isode)?)?\\s*(\\d+)",
        episodeIndex: 3,
      },
      {
        pattern: "^(s(eason)?)?[\\s-_]*(\\d+)",
        seasonIndex: 3,
      },
    ],

    renameAction: {
      pattern: "{{show}} - S{{season}}E{{episode}}. {{title}}"
    },
    moveAction: {
      pattern: "../{{show}} - S{{season}}E{{episode}}. {{title}}"
    },
    copyActions: [
      {
        pattern: "../{{show}} - S{{season}}E{{episode}}. {{title}}"
      },
      {
        pattern: "../{{show}} - S{{season}}E{{episode}}. {{title}}"
      },
      {
        pattern: "../{{show}} - S{{season}}E{{episode}}. {{title}}"
      }
    ]
  };
  return defaultSettings;
}
