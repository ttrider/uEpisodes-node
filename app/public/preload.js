/* eslint-disable @typescript-eslint/no-var-requires */
const { ipcRenderer } = require("electron");

console.info("preload");

// contextBridge.exposeInMainWorld("myAPI", {
//   desktop: true,
// });

function provideMetadata(params) {
  return ipcRenderer.invoke("provide-metadata", params);
}
function lookupMetadata(params) {
  return ipcRenderer.invoke("lookup-metadata", params);
}

window.ipcRenderer = ipcRenderer;
window.provideMetadata = provideMetadata;
window.lookupMetadata = lookupMetadata;
window.myApi = { desktop: true };
