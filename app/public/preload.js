/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require("electron");

console.info("preload");

// contextBridge.exposeInMainWorld("myAPI", {
//   desktop: true,
// });

function provideMetadata(params) {
  return ipcRenderer.invoke("provide-metadata", params);
}
window.provideMetadata = provideMetadata;
window.myApi = { desktop: true };
