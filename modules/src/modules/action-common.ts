import type { ActionType } from "./action-manager";


export type ActionStatus = "waiting" | "running" | "completed" | "canceled" | "skipped" | "error";


export interface EpisodeFileItem {
  filePath: string;
  showName: string | null;
  episodeName: string | null;
  season: number | null;
  episode: number | null;
  episodeAlt: number | null;
  episodeNameAlt: string | null;
}

export interface ActionPattern {
  pattern: string;
}


export interface ActionManagerAction {
  id: string;
  type: ActionType,
  source: string;
  target: string;
  dependsOn: string[];
}

export interface ActionItemState {
  id: string,
  progress?: number;
  status: ActionStatus;
  errorMessage?: string;
  results?: {
    sourcePath: string;
    targetPath: string;
  }
}
