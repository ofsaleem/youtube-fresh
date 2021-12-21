const { contextBridge, ipcRenderer } = require('electron')

const downloadFFBinaries = () => {
  return ipcRenderer.invoke('get-ffbinaries').then(result => {
    return result;
  }).catch(() => {
    console.log("Error determining platform");
  });
}

contextBridge.exposeInMainWorld(
  'ffbinaries', 
  {
    downloadFFBinaries: () => downloadFFBinaries()
  }
);