import path from "path";
import {
  filePathParser,
  getMetadataCandidates,
  ShowEpisodeInfo,
} from "uepisodes-modules";
import { client } from "./http-client";

export async function provideMetadata(params: {
  basePath: string;
  filePath: string;
}) {
  try {
    const { basePath, filePath } = params;

    const parts = basePath
      ? path.resolve(basePath, filePath).split(path.sep)
      : [path.basename(filePath)];

    const fileMetadata = filePathParser(parts);

    const candidates = (
      await getMetadataCandidates(client, fileMetadata)
    ).map<ShowEpisodeInfo>((c) => ({
      showName: c.showMetadata.title,
      season: c.episodeMetadata.season,
      episode: c.episodeMetadata.episode,
      episodeAlt: c.episodeMetadataAlt
        ? c.episodeMetadataAlt.episode
        : undefined,
      episodeName: c.episodeMetadata.title,
      episodeNameAlt: c.episodeMetadataAlt
        ? c.episodeMetadataAlt.title
        : undefined,
      signature: c.signature,
    }));
    return candidates;
  } catch (e) {
    console.error(e);
    return [];
  }
}
