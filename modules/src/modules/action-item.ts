import { ActionItemState, ActionManagerAction, ActionStatus } from "./action-common";

export interface ActionItemOwner {

  onStateChanged: (state: ActionItemState) => void;
}

export abstract class ActionItem {
  private _status: ActionStatus;

  protected _id: string;
  protected waitFor: Promise<ActionItemState> | undefined;
  protected dependsOn: ActionItem[] = [];

  constructor(protected owner: ActionItemOwner, id: string) {
    this._id = id;
    this._status = "waiting";
  }

  public dependsOnAction(...action: ActionItem[]) {
    this.dependsOn.push(...action);
  }

  public get status() {
    return this._status;
  }

  public get id() {
    return this._id;
  }

  private updateState(value: ActionItemState | ActionStatus) {

    if (typeof value === "string") {
      this._status = value;

      this.owner.onStateChanged({
        id: this.id,
        status: value
      });

    } else {
      this._status = value.status;
      this.owner.onStateChanged(value);
    }
  }

  public run(): Promise<ActionItemState> {
    if (!this.waitFor) {
      const depActions = this.dependsOn.map((dep) => {
        return dep.run();
      });
      this.updateState("waiting");
      this.waitFor = Promise.all(depActions)
        .then((results) => {

          // continue running only if all of the succeeded
          const ready = results.every(item => item.status === "completed");
          if (ready) {
            this.updateState("running");
            return this.doRun();
          }
          return {
            id: this.id,
            status: "skipped"
          } as ActionItemState;
        })
        .then((s) => {
          this.updateState(s);
          return s;
        })
    }
    return this.waitFor;
  }

  protected abstract doRun(): Promise<ActionItemState>;
}

export class NoneActionItem extends ActionItem {

  constructor(owner: ActionItemOwner, params: ActionManagerAction) {
    super(owner, params.id);
  }

  doRun(): Promise<ActionItemState> {
    return Promise.resolve({ id: this.id, status: "completed" } as ActionItemState);
  }

  static create(owner: ActionItemOwner, params: ActionManagerAction): ActionItem {
    return new NoneActionItem(owner, params);
  }
}
