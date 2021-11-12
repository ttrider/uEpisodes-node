import path from "path";
import { FileTypes, SettingsModule } from "@/store/settings";
import ft from "file-type";

export class FileSystemItem {
  filePath: string;
  error?: string;
  size: number;
  mode: FileTypes | "folder";
  children: FileSystemItem[] = [];
  expanded = true;

  constructor(params: {
    filePath: string;
    mode: FileTypes | "folder";
    size?: number;
    error?: string;
  }) {
    this.filePath = params.filePath;
    this.error = params.error;
    this.size = params.size ?? 0;
    this.mode = params.mode;
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

  async initialize() {
    if (!this.error) {
      if (this.mode !== "folder") {
        const ext = path.extname(this.filePath);
        const mode = SettingsModule.fileTypes[ext];
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
      }
    }
  }
}
