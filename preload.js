const { contextBridge, ipcRenderer } = require('electron')

const downloadFFBinaries = () => {
  return ipcRenderer.invoke('get-ffbinaries').then(result => {
    return result;
  }).catch(() => {
    console.error("Error determining platform");
  });
}

const renderWithVectorscope = (mp3path, imagepath, output) => {
  return ipcRenderer.invoke('ffmpeg-vectorscope').then(result => {
    return result;
  }).catch(() => {
    console.error("Error rendering output video file");
  });
}

contextBridge.exposeInMainWorld(
  'ffbinaries', 
  {
    downloadFFBinaries: () => downloadFFBinaries()
  },
  'ffmpeg',
  {
    input: (fpath) => input(fpath),
    renderWithVectorscope: (mp3path, imagepath, output) => renderWithVectorscope(mp3path, imagepath, output)
  }
);
