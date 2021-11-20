import path from "path";
import os from "os";
import { stat, mkdir, writeFile, readFile, utimes } from "fs/promises";
import axios, { AxiosResponse } from "axios";
import { readAll } from "csv-string";
import { FileMetadata } from "./name-parser";

export type ShowMetadata = {
  tokens: string[];
  title: string;
  directory: string;
  //tvrage?: number;
  id?: string;
  startDate?: Date;
  endDate?: Date;
  numberOfEpisodes?: number;
  runTime?: number;
  network?: string;
  country?: string;
  onHiatus?: string;
  onHiatusDesc?: string;
};

declare type EpisodeMetadata = {
  number: string;
  season: number;
  episode: number;
  airDate: Date;
  title: string;
  tvmazeUri: string;
};

export interface MetadataProvider {
  getShows(): Promise<Record<string, ShowMetadata>>;
  getShowById(id: string): Promise<EpisodeMetadata[]>;
  detectEpisode(fileMetadata: FileMetadata): Promise<EpisodeMetadata[]>;
}

const allShowsUrl = "https://epguides.com/common/allshows.txt";
const tvMazeShowUrl = "https://epguides.com/common/exportToCSVmaze.asp?maze=";
const refreshTime = 1000 * 60 * 60 * 8; // 8 hours

export class EpGuidesMetadataProvider implements MetadataProvider {
  showMetadataSet: Record<string, ShowMetadata> | undefined;
  showMetadataTimestamp = 0;
  showEpisodeMetadata: Record<
    string,
    { episodes: EpisodeMetadata[]; timestamp: number }
  > = {};
  async getShows() {
    if (this.showMetadataSet) {
      const now = Date.now();
      if (now - this.showMetadataTimestamp < refreshTime) {
        return this.showMetadataSet;
      }
    }
    const metadata = await getMetadata(
      allShowsUrl,
      processShowList,
      undefined,
      false
    );
    if (metadata) {
      this.showMetadataSet = metadata;
      this.showMetadataTimestamp = Date.now();
      return metadata;
    }

    return {} as Record<string, ShowMetadata>;
  }
  async getShowById(id: string) {
    const emd = this.showEpisodeMetadata[id];

    if (emd) {
      const now = Date.now();
      if (now - emd.timestamp < refreshTime) {
        return emd.episodes;
      }
    }
    const metadata = await getMetadata(
      tvMazeShowUrl + id,
      processEpisodeList,
      /<pre>(.*?)<\/pre>/gs,
      false
    );
    if (metadata) {
      this.showEpisodeMetadata[id] = {
        episodes: metadata,
        timestamp: Date.now(),
      };
      return metadata;
    }

    return [] as EpisodeMetadata[];
  }

  async detectEpisode(fileMetadata: FileMetadata) {
    const ret: EpisodeMetadata[] = [];

    const showSet = Object.values(await this.getShows());

    const shows = (
      Array.isArray(fileMetadata.showName)
        ? fileMetadata.showName
        : fileMetadata.showName
        ? [fileMetadata.showName]
        : []
    ).map((t) => getTokens(t));
    const seasons = Array.isArray(fileMetadata.season)
      ? fileMetadata.season
      : fileMetadata.season != undefined
      ? [fileMetadata.season]
      : [];
    const episodes = Array.isArray(fileMetadata.episode)
      ? fileMetadata.episode
      : fileMetadata.episode != undefined
      ? [fileMetadata.episode]
      : [];

    for (const showCandidate of shows) {
      for (const showMetadata of showSet) {
        const c = compareTokens(showCandidate, showMetadata.tokens);
      }
    }

    return ret;
  }
}

function compareTokens(tokensA: string[], tokensB: string[]) {
  const ret = {
    exactMatch: false,
    a: 0,
    b: 0,
    both: 0,
  };

  const setA = new Set<string>();
  const setB = new Set<string>();

  let exactMatch = true;
  const length = Math.max(tokensA.length, tokensB.length);
  for (let index = 0; index < length; index++) {
    const ta = tokensA[index];
    const tb = tokensB[index];
    if (ta !== tb) {
      exactMatch = false;
    }
    if (ta) {
      setA.add(ta);
    }
    if (tb) {
      setB.add(tb);
    }
  }
  if (exactMatch) {
    ret.exactMatch = true;
    ret.both = length;
    return ret;
  }

  for (const a of setA) {
    if (setB.delete(a)) {
      ret.both++;
    } else {
      ret.a++;
    }
  }
  ret.b = setB.size;
  return ret;
}

async function getMetadata<T>(
  fileUrl: string,
  factory: (body: string) => Promise<T>,
  filter?: RegExp,
  forceRefresh?: boolean
) {
  const url = new URL(fileUrl);

  const urlFile = url.pathname.replace(/[:/\\.?=]/g, "-") + ".json";
  const outputFile = path.resolve(os.tmpdir(), "uepisodes/epguides", urlFile);

  const modifiedTime = forceRefresh
    ? undefined
    : await getModifiedTime(outputFile);

  const shouldDownload = await head(fileUrl, modifiedTime);
  if (shouldDownload) {
    const dataString = await get(fileUrl);
    if (dataString?.data) {
      const inputData = filter
        ? filter.exec(dataString.data)?.[1]?.trim()
        : dataString.data;

      const metadata = await factory(inputData);
      await mkdir(path.dirname(outputFile), { recursive: true });
      await writeFile(outputFile, JSON.stringify(metadata, null, 2));

      if (dataString.lastModified) {
        await utimes(
          outputFile,
          dataString.lastModified,
          dataString.lastModified
        );
      }
      return metadata;
    }
  }
  // let's try to load cached version
  try {
    const buffer = await readFile(outputFile);
    const metadata = JSON.parse(buffer.toString()) as T;
    return metadata;
  } catch (e) {
    console.error(e);
  }
  return {} as T;
}

async function getModifiedTime(path: string) {
  try {
    // check if exists and get the last modifed date
    const fStats = await stat(path);
    if (fStats) {
      return fStats.mtime;
    }
    return undefined;
  } catch (e) {
    const err = e as { code: string; errno: number };
    // if file/path doen"t exists, return null
    if (err && err.code === "ENOENT" && err.errno === -2) {
      return undefined;
    }
    // otherwise - re-throw;
    throw err;
  }
}

async function head(url: string, lastUpdated?: Date) {
  if (lastUpdated === undefined) return true;

  try {
    const response = await axios.head(url, {
      headers: {
        "if-modified-since": lastUpdated.toUTCString(),
      },
    });

    if (response.status) {
      if (response.status === 304) {
        return false;
      }
      if (response.status < 400) {
        return true;
      }
    }
  } catch (e) {
    const response = (e as unknown as { response?: AxiosResponse<any, any> })
      .response;
    if (response) {
      if (response.status) {
        if (response.status === 304) {
          return false;
        }
        if (response.status < 400) {
          return true;
        }
      }
    }
    return false;
  }
}

async function get(url: string) {
  const response = await axios.get(url);

  if (response?.status == 200) {
    return {
      data: response.data,
      lastModified: parseDate(response.headers["last-modified"]),
    };
  }
  console.error(response.statusText);
  return;
}

async function processShowList(dataString: string) {
  const data = await parseCSV(dataString);

  const showSet: Record<string, ShowMetadata> = {};

  for (const showRecord of data) {
    const showMetadata: ShowMetadata = {
      tokens: [],
      title: showRecord["title"],
      directory: showRecord["directory"],
      //tvrage?: number;
      id: showRecord["TVmaze"],
      startDate: parseDate(showRecord["start date"]),
      endDate: parseDate(showRecord["end date"]),
      numberOfEpisodes: parseNumber(showRecord["number of episodes"]),
      runTime: parseNumber(showRecord["run time"]),
      network: showRecord["network"],
      country: showRecord["country"],
      onHiatus: showRecord["onhiatus"],
      onHiatusDesc: showRecord["onhiatusdesc"],
    };
    if (showMetadata.id) {
      // generate tokens
      showMetadata.tokens = getTokens(showMetadata.title);

      showSet[showMetadata.id] = showMetadata;
    }
  }
  return showSet;
}

async function processEpisodeList(dataString: string) {
  const data = await parseCSV(dataString);

  const episodeSet: EpisodeMetadata[] = [];

  for (const showRecord of data) {
    const episodeMetadata: EpisodeMetadata = {
      number: showRecord["number"],
      season: parseNumber(showRecord["season"]) ?? 0,
      episode: parseNumber(showRecord["episode"]) ?? 0,
      airDate: parseDate(showRecord["airdate"]) ?? new Date(),
      title: showRecord["title"],
      tvmazeUri: showRecord["tvmaze link"],
    };
    episodeSet.push(episodeMetadata);
  }
  return episodeSet;
}

function parseCSV(dataString: string) {
  return new Promise<Record<string, string>[]>((resolve) => {
    const data: Record<string, string>[] = [];

    const n = readAll(dataString, (rows) => {
      parseCsvRecords(rows, data);
    });
    console.info(n);
    resolve(data);
  });
}

function getTokens(value: string) {
  if (value) {
    return value
      .toLowerCase()
      .replace(/["'`,:?]/gim, "")
      .replace(/[/\\.,+-]/gim, " ")
      .replace(/\s{2,}/gim, "")
      .split(/\s/gim)
      .filter((s) => !!s)
      .map((s) => s.trim());
  }
  return [];
}

function parseCsvRecords(rows: string[][], data: Record<string, string>[]) {
  if (rows.length > 0) {
    const columnNames = rows[0];
    for (let index = 1; index < rows.length; index++) {
      const row = rows[index];
      const rd: Record<string, string> = {};
      for (let ri = 0; ri < Math.min(row.length, columnNames.length); ri++) {
        rd[columnNames[ri]] = row[ri];
      }
      data.push(rd);
    }
  }
}

function parseDate(value: string) {
  if (value) {
    const d = new Date(value);
    if (d && !isNaN(d.valueOf())) {
      return d;
    }
  }
  return;
}

function parseNumber(value: string) {
  if (value != undefined) {
    const d = parseInt(value);
    if (!isNaN(d)) {
      return d;
    }
  }
  return;
}
