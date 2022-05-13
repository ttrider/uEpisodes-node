import { ActionItemState, ActionManagerAction } from "./action-common";
import { ActionItem, ActionItemOwner } from "./action-item";
import fs from "fs-extra";
import path from "path";



abstract class FileActionItem extends ActionItem {
  sourcePath: string;
  targetPath: string;

  constructor(owner: ActionItemOwner, params: ActionManagerAction) {
    super(owner, params.id);
    this.sourcePath = path.resolve(params.source);
    this.targetPath = path.resolve(params.target);
  }


  async doRun(): Promise<ActionItemState> {

    try {

      const { source, target } = this.preprocess(this.sourcePath, this.targetPath)

      if (!await fs.pathExists(source)) {
        return {
          id: this.id,
          status: "error",
          errorMessage: `'${source}' was not found`
        };
      }
      const targetPath = await this.ensureUniqueFilePath(target);

      this.process(source, targetPath);

      return {
        id: this.id,
        status: "completed",
        results: {
          sourcePath: source,
          targetPath
        }
      };

    }
    catch (err) {
      return {
        id: this.id,
        status: "error",
        errorMessage: (err as Error).message,
      };
    }
  }


  async ensureUniqueFilePath(filePath: string) {

    const dir = path.dirname(filePath);
    const ext = path.extname(filePath);
    const name = path.basename(filePath, ext);

    let targetPath = filePath;
    let index = 1;
    while (await fs.pathExists(targetPath)) {
      // we need to rename destination
      targetPath = path.resolve(dir, `${name} [${index++}]${ext}`);
    }
    return targetPath;
  }

  preprocess(source: string, target: string) {
    return { source, target };
  }

  abstract process(source: string, target: string): Promise<void>;
}


export class RenameActionItem extends FileActionItem {

  process(source: string, target: string): Promise<void> {
    return fs.move(source, target, { overwrite: false });
  }

  preprocess(source: string, target: string) {
    // in the case of rename, we are going to keep the target file in the same location
    const dirname = path.dirname(source);
    const name = path.basename(target);
    return {
      source,
      target: path.resolve(dirname, name)
    }
  }

  static create(owner: ActionItemOwner, params: ActionManagerAction): RenameActionItem {
    return new RenameActionItem(owner, params);
  }
}

export class MoveActionItem extends FileActionItem {
  process(source: string, target: string): Promise<void> {
    return fs.move(source, target, { overwrite: false });
  }

  static create(owner: ActionItemOwner, params: ActionManagerAction): MoveActionItem {
    return new MoveActionItem(owner, params);
  }
}

export class CopyActionItem extends FileActionItem {
  process(source: string, target: string): Promise<void> {
    return fs.copy(source, target, {
      dereference: true,
      errorOnExist: true,
      overwrite: false,
      preserveTimestamps: true
    });
  }

  static create(owner: ActionItemOwner, params: ActionManagerAction): CopyActionItem {
    return new CopyActionItem(owner, params);
  }
}

export class CleanupActionItem extends ActionItem {

  constructor(owner: ActionItemOwner, params: ActionManagerAction) {
    super(owner, params.id);
  }

  doRun(): Promise<ActionItemState> {
    return Promise.resolve({ id: this.id, status: "completed" } as ActionItemState);
  }

  static create(owner: ActionItemOwner, params: ActionManagerAction): CleanupActionItem {
    return new CleanupActionItem(owner, params);
  }
}
