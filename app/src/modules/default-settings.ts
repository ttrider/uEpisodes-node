export interface SettingsData {
  version: number;
  fileTypes: {
    video?: string;
    caption?: string;
    other?: string;
    image?: string;
  };

  nameParsers: {
    pattern: string;
    titleIndex?: number;
    seasonIndex?: number;
    episodeIndex?: number;
    episodeIndexAlt?: number;
    usePath?: boolean;
  }[];

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
    fileTypes: {
      video:
        ".3g2, .amv, .asf, .avi, .drc, .f4a, .f4b, .f4p, .f4v, .flv, .M2TS, .m2v, .m4p, .m4v, .mkv, .mng, .mov, .mp2, .mp4, .mpe, .mpeg, .mpg, .mpv, .MTS, .mxf, .nsv, .ogg, .ogv, .qt, .rm, .rmvb, .roq, .svi, .viv, .vob, .webm, .wmv, .yuv, ",
      caption: ".srt, .scc, .stl",
    },
    nameParsers: [
      {
        pattern:
          "^((.*?)(?:[^\\w\\d]|_)+)?(s(\\d+)(?:[\\s.-]*)?e\\s?(\\d+))(-?e?(\\d+))?",
        titleIndex: 2,
        seasonIndex: 4,
        episodeIndex: 5,
        episodeIndexAlt: 7,
      },
      {
        pattern:
          "^((.*?)(?:[^\\w\\d]|_)+)?(season\\s+(\\d+))\\s*((episode\\s+(\\d+))-?(\\d+)?)?",
        titleIndex: 1,
        seasonIndex: 4,
        episodeIndex: 7,
        episodeIndexAlt: 8,
      },
      {
        pattern: "^((.*?)(?:[^\\w\\d]|_)+)?((\\d+)x(\\d+))(-?(\\d+))?",
        titleIndex: 2,
        seasonIndex: 4,
        episodeIndex: 5,
        episodeIndexAlt: 7,
      },
      {
        pattern:
          "^((.*?)(?:[^\\w\\d]|_)+)?(\\d?\\d)(\\d\\d)(?:[^\\w\\d]|_)+(\\d\\d)?",
        titleIndex: 2,
        seasonIndex: 3,
        episodeIndex: 4,
        episodeIndexAlt: 5,
      },
      {
        pattern: "^((.*?)(?:[^\\w\\d]|_)+)?s(\\d+)",
        titleIndex: 2,
        seasonIndex: 3,
      },
      {
        pattern: "^((.*?)(?:[^\\w\\d]|_)+)?ep?(\\d+)",
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
  };
  return defaultSettings;
}
