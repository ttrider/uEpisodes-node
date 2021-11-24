import { parse } from "../app/src/modules/name-parser";
import getMetadataCandidates from "../app/src/modules/epguides-provider";
import getLogger from "../app/src/modules/logger";
import fs from "fs";

const logger = getLogger("output", "debug");

async function run() {

  const testSets = JSON.parse(
    fs.readFileSync("test-sets.json").toString()
  );

  const total = testSets.files.length;
  for (let index = 0; index < testSets.files.length; index++) {
    const f = testSets.files[index];
    logger.debug(index, f.path);

    const results = parse(f.path);

    const candidates = await getMetadataCandidates(results);

    for (const c of candidates.map(v => ({
      rank: v.rank,
      show: v.showMetadata.title,
      season: v.episodeMetadata.season,
      episode: v.episodeMetadata.episode,
      title: v.episodeMetadata.title,
      episodeAlt: v.episodeMetadataAlt?.episode,
      titleAlt: v.episodeMetadataAlt?.title,
      signature: v.signature
    }))) {

      logger.debug(index, c.rank, c.signature, c.show, c.season, c.episode, c.title, c.episodeAlt, c.titleAlt);

    }
  }





}

run();