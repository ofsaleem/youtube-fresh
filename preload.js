const { contextBridge, ipcRenderer } = require('electron')

const detectPlatform = () => {
  const result = ipcRenderer.invoke('ffbinaries-detect-platform');
  return result;
}

contextBridge.exposeInMainWorld(
  'ffbinaries', 
  {
    detectPlatform: () => detectPlatform()
  }
);