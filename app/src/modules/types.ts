export type ShowMetadata = {
  tokens: string[];
  title: string;
  directory: string;
  //tvrage?: number;
  id: string;
  startDate?: Date;
  endDate?: Date;
  numberOfEpisodes?: number;
  runTime?: number;
  network?: string;
  country?: string;
  onHiatus?: string;
  onHiatusDesc?: string;
};

export type ShowMetadataSet = Record<string, ShowMetadata>;

export declare type EpisodeMetadata = {
  number: string;
  season: number;
  episode: number;
  airDate: Date;
  title: string;
  tvmazeUri: string;
};

export declare type EpisodeTree = {
  [name: number]: { [name: number]: EpisodeMetadata };
};

export interface ShowEpisodeMetadata {
  episodes: EpisodeMetadata[];
  episodeTree: EpisodeTree;
}

export interface MetadataProvider {
  detectEpisode(fileMetadata: FileMetadata): Promise<
    {
      rank: number;
      showMetadata: ShowMetadata;
      episodeMetadata: EpisodeMetadata;
    }[]
  >;
}

export interface FileMetadata {
  showName: string[];
  season: number[];
  episode: number[];
  episodeAlt: number[];
  signature?: string;
  showTokens: string[][];
}
