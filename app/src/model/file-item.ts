import path from "path";
import { FileTypes, SettingsModule } from "../store/settings";
import ft from "file-type";
import { ActionManagerClient, ShowEpisodeInfo } from "uepisodes-modules";
import { EpisodeFileItem } from "uepisodes-modules/dist/modules/action-common";

const provideMetadata: (params: {
  basePath: string;
  filePath: string;
}) => Promise<ShowEpisodeInfo[]> = (window as any).provideMetadata;



export class FileSystemItem implements EpisodeFileItem {
  filePath: string;
  basePath?: string;
  error?: string;
  size: number;
  mode: FileTypes | "folder";
  showName: string | null = null;
  episodeName: string | null = null;
  season: number | null = null;
  episode: number | null = null;
  episodeAlt: number | null = null;
  episodeNameAlt: string | null = null;
  candidates: ShowEpisodeInfo[] = [];
  children: FileSystemItem[] = [];
  status: "" | "ready" | "loading..." = "";
  expanded = true;

  constructor(params: {
    filePath: string;
    basePath?: string;
    mode: FileTypes | "folder";
    size?: number;
    error?: string;
  }) {
    this.filePath = params.filePath;
    this.error = params.error;
    this.size = params.size ?? 0;
    this.mode = params.mode;
    this.basePath = params.basePath;
  }

  get pathParts() {
    return this.filePath.split(path.sep);
  }

  get title() {
    return this.name ? this.name : "FileSystem";
  }
  get name() {
    return this.pathParts.at(-1) ?? "";
  }
  get id() {
    return this.filePath;
  }

  get actions(): ActionItem[] {
    const actions = [];
    if (this.mode === "video" && this.status === "ready") {
      const renameAction = SettingsModule.data.renameAction
        ? new RenameActionItem(this, SettingsModule.data.renameAction)
        : undefined;

      actions.push(renameAction);

      const copyActions = SettingsModule.data.copyActions.map(
        (ap) => new CopyActionItem(this, ap, renameAction)
      );
      actions.push(...copyActions);

      const moveAction = SettingsModule.data.moveAction
        ? new MoveActionItem(
          this,
          SettingsModule.data.moveAction,
          renameAction,
          ...copyActions
        )
        : undefined;

      actions.push(moveAction);
    }
    return actions.filter((a) => !!a) as ActionItem[];
  }

  async initialize() {
    this.status = "loading...";
    const fileTypes = SettingsModule.fileTypes;

    if (!this.error) {
      if (this.mode !== "folder") {
        const ext = path.extname(this.filePath);
        const mode = fileTypes[ext];
        if (mode) {
          this.mode = mode;
        } else {
          const type = await ft.fromFile(this.filePath);
          if (type) {
            let mime = type.mime
              .split("/")[0]
              .trim()
              .toLowerCase() as FileTypes;
            if (mime != "video" && mime != "image" && mime != "caption") {
              mime = "other";
            }
            this.mode = mime;
            SettingsModule.addFileType({ type: mime, ext: type.ext });
          }
        }

        if (this.mode === "video") {
          this.candidates = await provideMetadata({
            basePath: this.basePath ?? "",
            filePath: this.filePath,
          });

          // const parts = this.basePath
          //   ? path.resolve(this.basePath, this.filePath).split(path.sep)
          //   : [this.name];

          // const fileMetadata = filePathParser(parts, SettingsModule.data);

          // this.candidates = (
          //   await getMetadataCandidates(client, fileMetadata)
          // ).map<ShowEpisodeInfo>((c) => ({
          //   showName: c.showMetadata.title,
          //   season: c.episodeMetadata.season,
          //   episode: c.episodeMetadata.episode,
          //   episodeAlt: c.episodeMetadataAlt?.episode,
          //   episodeName: c.episodeMetadata.title,
          //   episodeNameAlt: c.episodeMetadataAlt?.title,
          //   signature: c.signature,
          // }));

          if (this.candidates.length > 0) {
            const candidate = this.candidates[0];
            this.showName = candidate.showName;
            this.season = candidate.season;
            this.episode = candidate.episode;
            this.episodeAlt = candidate.episodeAlt ?? null;
            this.episodeName = candidate.episodeName;
            this.episodeNameAlt = candidate.episodeNameAlt ?? null;
          }
        }
        this.status = this.candidates.length === 1 ? "ready" : "";
      }
    }
  }
}

export abstract class ActionItem {
  protected dependsOn: ActionItem[];

  status = "";

  protected waitFor: Promise<void> | undefined;

  constructor(
    protected parent: FileSystemItem,
    protected options: { pattern: string },
    ...dependsOn: (ActionItem | undefined)[]
  ) {
    this.dependsOn = dependsOn.filter((a) => !!a) as ActionItem[];
  }

  run(): Promise<void> {
    // check dependencies

    const depActions = this.dependsOn.map((dep) => {
      if (dep.waitFor) {
        return dep.waitFor;
      }
      return dep.run();
    });
    this.status = "waiting";
    this.waitFor = Promise.all(depActions)
      .then(() => {
        this.status = "running";
        return this.doRun();
      })
      .then(() => {
        this.status = "completed";
      })
      .catch(() => {
        this.status = "error";
      });
    return this.waitFor;
  }

  abstract doRun(): Promise<void>;
}

export class RenameActionItem extends ActionItem {
  async doRun() {
    return new Promise<void>((resolve) => {
      let n = 0;
      const i = setInterval(() => {
        n += 10;
        this.status = `running: ${n}%`;
      }, 1000);

      setTimeout(() => {
        clearInterval(i);
        resolve();
      }, 10000);
    });
  }
}
export class CopyActionItem extends ActionItem {
  async doRun() {
    return new Promise<void>((resolve) => {
      let n = 0;
      const i = setInterval(() => {
        n += 10;
        this.status = `running: ${n}%`;
      }, 1000);

      setTimeout(() => {
        clearInterval(i);
        resolve();
      }, 10000);
    });
  }
}
export class MoveActionItem extends ActionItem {
  async doRun() {
    return new Promise<void>((resolve) => {
      let n = 0;
      const i = setInterval(() => {
        n += 10;
        this.status = `running: ${n}%`;
      }, 1000);

      setTimeout(() => {
        clearInterval(i);
        resolve();
      }, 10000);
    });
  }
}
