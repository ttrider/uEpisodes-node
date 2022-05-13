"use strict";

import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS_DEVTOOLS } from "electron-devtools-installer";
import { ActionManager } from "uepisodes-modules";
import path from "path";
const isDevelopment = process.env.NODE_ENV !== "production";
import { lookupMetadata, provideMetadata } from "./electron/metadata-provider";

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

declare const __static: string;

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: "app", privileges: { secure: true, standard: true } },
]);

const actionManger = new ActionManager(ipcMain);

ipcMain.handle(
  "provide-metadata",
  (e, arg: { basePath: string; filePath: string }) => {
    return provideMetadata(arg);
  }
);

ipcMain.handle(
  "lookup-metadata",
  (
    e,
    params: {
      showName: string;
      season: string;
      episode: string;
    }
  ) => {
    return lookupMetadata(params);
  }
);

// ipcMain.on(
//   "get-metadata-candidates",
//   (event, arg: { basePath: string; filePath: string }) => {
//     console.log(arg);

//     const parts = arg.basePath
//       ? path.resolve(arg.basePath, arg.filePath).split(path.sep)
//       : [path.basename(arg.filePath)];

//     const fileMetadata = filePathParser(parts);

//     getMetadataCandidates(fileMetadata).then((res) => {
//       const candidates = res.map<ShowEpisodeInfo>((c) => ({
//         showName: c.showMetadata.title,
//         season: c.episodeMetadata.season,
//         episode: c.episodeMetadata.episode,
//         episodeAlt: c.episodeMetadataAlt
//           ? c.episodeMetadataAlt.episode
//           : undefined,
//         episodeName: c.episodeMetadata.title,
//         episodeNameAlt: c.episodeMetadataAlt
//           ? c.episodeMetadataAlt.title
//           : undefined,
//         signature: c.signature,
//       }));

//       event.reply("get-metadata-candidates-reply", candidates);
//     });
//   }
// );

async function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env
        .ELECTRON_NODE_INTEGRATION as unknown as boolean,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      //contextIsolation: true,
      enableRemoteModule: true,
      // __static is set by webpack and will point to the public directory
      preload: path.resolve(__static, "preload.js"),
    },
  });

  actionManger.addClientListener(win.webContents);

  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode
    await win.loadURL(process.env.WEBPACK_DEV_SERVER_URL as string);
    if (!process.env.IS_TEST) win.webContents.openDevTools();
  } else {
    createProtocol("app");
    // Load the index.html when not in development
    win.loadURL("app://./index.html");
  }

  win.on("closed", () => {
    actionManger.removeClientListener(win.webContents);
  });
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      await installExtension(VUEJS_DEVTOOLS);
    } catch (e: any) {
      console.error("Vue Devtools failed to install:", e.toString());
    }
  }
  createWindow();
});

app.on(
  "certificate-error",
  (event, webContents, url, error, certificate, callback) => {
    console.warn("certificate-error");
    // if (url === "https://github.com") {
    // Verification logic.
    event.preventDefault();
    callback(true);
    // } else {
    //   callback(false);
    // }
  }
);

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === "win32") {
    process.on("message", (data) => {
      if (data === "graceful-exit") {
        actionManger.dispose();
        app.quit();
      }
    });
  } else {
    process.on("SIGTERM", () => {
      actionManger.dispose();
      app.quit();
    });
  }
}
