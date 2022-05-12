




export interface ActionManagerEvent {
  send(channel: string, ...args: any[]): void;
}

export interface ActionManagerClientIPC extends NodeJS.EventEmitter {
  on(channel: string, listener: (event: ActionManagerEvent, ...args: any[]) => void): this;
  invoke(channel: string, ...args: any[]): Promise<any>;
}

export interface ActionManagerIPC extends NodeJS.EventEmitter {
  on(channel: string, listener: (event: ActionManagerEvent, ...args: any[]) => void): this;
  //invoke(channel: string, ...args: any[]): Promise<any>;
  handle(channel: string, listener: (event: ActionManagerEvent, ...args: any[]) => (Promise<void>) | (any)): void;
}

export interface ActionManagerSender {
  send(channel: string, ...args: any[]): void;
}

export interface ActionItemStatus {
  id: string,
  progress?: number;
  status: "waiting" | "running" | "success" | "error" | "canceled"
}

export class ActionItem {
  id: string;

  constructor(id: string) {
    this.id = id;
  }
}


export class ActionManagerClient {
  ipcRenderer: ActionManagerClientIPC;

  constructor() {
    this.ipcRenderer = (window as any).ipcRenderer;

    this.ipcRenderer.on("action-manager:status", (event: ActionManagerEvent, itemStatus: ActionItemStatus) => {
      console.info("ActionManagerClient", "action-manager:status", itemStatus);
    });
  }

  enqueueActions(actions: ActionItem[]) {
    this.ipcRenderer.invoke("action-manager:enqueue", {
      actions
    })
  }
}


export class ActionManager {

  ipcMain: ActionManagerIPC;
  sender?: ActionManagerSender;

  constructor(ipcMain: ActionManagerIPC) {
    this.ipcMain = ipcMain;

    this.ipcMain.handle("action-manager:enqueue", (event: ActionManagerEvent, itemStatus: ActionItemStatus) => {
      console.info("ActionManager:", "action-manager:enqueue", itemStatus);


      setTimeout(() => {

        this.sender?.send("action-manager:status", itemStatus);

        // this.ipcMain.invoke("action-manager:enqueue", {
        //   id: "foobar",
        //   status: "running",
        //   progress: 20
        // } as ActionItemStatus)

      }, 500);

    });
  }

  dispose() {

  }

}




// export abstract class ActionItem {
//   protected dependsOn: ActionItem[];

//   status = "";

//   protected waitFor: Promise<void> | undefined;

//   constructor(
//     protected parent: FileSystemItem,
//     protected options: { pattern: string },
//     ...dependsOn: (ActionItem | undefined)[]
//   ) {
//     this.dependsOn = dependsOn.filter((a) => !!a) as ActionItem[];
//   }

//   run(): Promise<void> {
//     // check dependencies

//     const depActions = this.dependsOn.map((dep) => {
//       if (dep.waitFor) {
//         return dep.waitFor;
//       }
//       return dep.run();
//     });
//     this.status = "waiting";
//     this.waitFor = Promise.all(depActions)
//       .then(() => {
//         this.status = "running";
//         return this.doRun();
//       })
//       .then(() => {
//         this.status = "completed";
//       })
//       .catch(() => {
//         this.status = "error";
//       });
//     return this.waitFor;
//   }

//   abstract doRun(): Promise<void>;
// }

// export class RenameActionItem extends ActionItem {
//   async doRun() {
//     return new Promise<void>((resolve) => {
//       let n = 0;
//       const i = setInterval(() => {
//         n += 10;
//         this.status = `running: ${n}%`;
//       }, 1000);

//       setTimeout(() => {
//         clearInterval(i);
//         resolve();
//       }, 10000);
//     });
//   }
// }
// export class CopyActionItem extends ActionItem {
//   async doRun() {
//     return new Promise<void>((resolve) => {
//       let n = 0;
//       const i = setInterval(() => {
//         n += 10;
//         this.status = `running: ${n}%`;
//       }, 1000);

//       setTimeout(() => {
//         clearInterval(i);
//         resolve();
//       }, 10000);
//     });
//   }
// }
// export class MoveActionItem extends ActionItem {
//   async doRun() {
//     return new Promise<void>((resolve) => {
//       let n = 0;
//       const i = setInterval(() => {
//         n += 10;
//         this.status = `running: ${n}%`;
//       }, 1000);

//       setTimeout(() => {
//         clearInterval(i);
//         resolve();
//       }, 10000);
//     });
//   }
// }