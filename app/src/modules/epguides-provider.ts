import { getDefaultSettings, SettingsData } from "./default-settings";
import {
  ShowMetadata,
  ShowEpisodeMetadata,
  EpisodeMetadata,
  EpisodeTree,
  FileMetadata,
  ShowMetadataSet,
} from "./types";
import { getTokens, parseCSV, parseDate, parseNumber } from "./common";

import getMetadata from "./data-client";
const allShowsUrl = "https://epguides.com/common/allshows.txt";
const tvMazeShowUrl = "https://epguides.com/common/exportToCSVmaze.asp?maze=";

function getShows() {
  return getMetadata(allShowsUrl, processShowList, undefined, false);
}

function getShowById(id: string) {
  return getMetadata(
    tvMazeShowUrl + id,
    processEpisodeList,
    /<pre>(.*?)<\/pre>/gs,
    false
  );
}

export default async function getMetadataCandidates(
  fileMetadata: FileMetadata,
  settings: SettingsData = getDefaultSettings()
) {
  const ret: {
    rank: number;
    showMetadata: ShowMetadata;
    episodeMetadata: EpisodeMetadata;
    episodeMetadataAlt?: EpisodeMetadata;
    signature?: string;
  }[] = [];

  const allShows = await getShows();

  const { showTokens, season, episode, episodeAlt } = fileMetadata;

  const knownShowId = fileMetadata.signature
    ? settings.knownSignatures[fileMetadata.signature]
    : undefined;
  if (knownShowId) {
    const showMetadata = allShows[knownShowId];
    if (showMetadata) {
      const showEpisodes = await getShowById(knownShowId);
      if (showEpisodes) {
        ret.push(...getShowMetadata(showMetadata, showEpisodes, 50));
        return ret;
      }
    }
  }

  const showCandidates = getCandidates(allShows, showTokens);
  for (const showCandidate of showCandidates) {
    const showEpisodes = await getShowById(showCandidate.showMetadata.id);
    if (showEpisodes) {
      ret.push(
        ...getShowMetadata(
          showCandidate.showMetadata,
          showEpisodes,
          showCandidate.rank
        )
      );
      if (showCandidate.rank === 100) {
        break;
      }
    }
  }

  return ret;

  function getShowMetadata(
    showMetadata: ShowMetadata,
    showEpisodeMetadata: ShowEpisodeMetadata,
    rank: number
    //c: { exactMatch: boolean; a: number; b: number; both: number }
  ) {
    const ret = [];

    for (const seasonIndex of season) {
      const sc = showEpisodeMetadata.episodeTree[seasonIndex];
      if (sc != undefined) {
        const ep = episode.map((ei) => sc[ei]).filter((i) => i);
        const epAlt = episodeAlt.map((ei) => sc[ei]).filter((i) => i);

        for (const ec of ep) {
          if (epAlt.length > 0) {
            for (const eca of epAlt) {
              ret.push({
                rank,
                showMetadata,
                episodeMetadata: ec,
                episodeMetadataAlt:
                  eca.episode !== ec.episode ? eca : undefined,
                signature: fileMetadata.signature,
              });
            }
          } else {
            ret.push({
              rank,
              showMetadata,
              episodeMetadata: ec,
              signature: fileMetadata.signature,
            });
          }
        }
      }
    }

    ret.sort((a, b) => {
      if (a.episodeMetadata.season < b.episodeMetadata.season) {
        return -1;
      }
      if (a.episodeMetadata.season > b.episodeMetadata.season) {
        return 1;
      }
      if (a.episodeMetadata.episode < b.episodeMetadata.episode) {
        return -1;
      }
      if (a.episodeMetadata.episode > b.episodeMetadata.episode) {
        return 1;
      }
      return 0;
    });

    return ret;
  }
}

function getCandidates(shows: ShowMetadataSet, tokens: string[][]) {
  const showCandidates = [];
  for (const showCandidate of tokens) {
    for (const showId in shows) {
      if (Object.prototype.hasOwnProperty.call(shows, showId)) {
        const showMetadata = shows[showId];
        const c = compareTokens(showCandidate, showMetadata.tokens);
        if (c.both) {
          showCandidates.push({
            rank: c.exactMatch ? 100 : c.both / showMetadata.tokens.length,
            showCandidate,
            showMetadata,
          });
        }
      }
    }
  }
  return showCandidates.sort((a, b) => (a.rank > b.rank ? -1 : 1)).slice(0, 5);
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

  return {
    episodes: episodeSet,
    episodeTree: episodeMetadataTree(episodeSet),
  } as ShowEpisodeMetadata;

  function episodeMetadataTree(episodes: EpisodeMetadata[]) {
    const ret: EpisodeTree = {};

    for (const episode of episodes) {
      let s = ret[episode.season];
      if (!s) {
        ret[episode.season] = s = {};
      }
      s[episode.episode] = episode;
    }
    return ret;
  }
}
