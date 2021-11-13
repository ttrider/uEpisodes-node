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
          "(.*)(?:[^\\w\\d]|_)+(s(\\d+)(?:[\\s\\.-]*)?e\\s?(\\d+))(\\d\\d)?",
        titleIndex: 1,
        seasonIndex: 3,
        episodeIndex: 4,
      },
      {
        pattern: "(.*)(?:[^\\w\\d]|_)+(season\\s+(\\d+)\\s+episode\\s+(\\d+))",
        titleIndex: 1,
        seasonIndex: 3,
        episodeIndex: 4,
      },
      {
        pattern: "(.*)(?:[^\\w\\d]|_)+((\\d+)x(\\d+))",
        titleIndex: 1,
        seasonIndex: 3,
        episodeIndex: 4,
      },
      {
        pattern: "(.*)(?:[^\\w\\d]|_)+(\\d)(\\d\\d)(?:[^\\w\\d]|_)+(\\d\\d)?",
        titleIndex: 1,
        seasonIndex: 2,
        episodeIndex: 3,
      },
      {
        pattern: "(.*)?\\s+(\\d\\d?)\\.(\\d\\d)(\\d\\d)?",
        titleIndex: 1,
        seasonIndex: 2,
        episodeIndex: 3,
      },
      {
        pattern: "[eE](\\d\\d?)[sS](\\d\\d)",
        seasonIndex: 2,
        episodeIndex: 3,
        usePath: true,
      },
    ],
  };
  return defaultSettings;
}
