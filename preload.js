const { contextBridge, ipcRenderer } = require('electron')

const downloadFFBinaries = () => {
  return ipcRenderer.invoke('get-ffbinaries').then(result => {
    return result;
  }).catch(() => {
    console.error("Error determining platform");
  });
}

const renderWithVectorscope = (mp3path, imagepath) => {
  return ipcRenderer.invoke('ffmpeg-vectorscope', mp3path, imagepath).then(result => {
    return result;
  }).catch(() => {
    console.error("Error rendering output video file");
  });
}

contextBridge.exposeInMainWorld(
  'ffbinaries', 
  {
    downloadFFBinaries: () => downloadFFBinaries()
  });
contextBridge.exposeInMainWorld(
  'ffmpeg',
  {
    renderWithVectorscope: (mp3path, imagepath) => renderWithVectorscope(mp3path, imagepath)
  }
);

ipcRenderer.on('ffmpeg-encoding-start', (event, commandLine) => {
  let output = document.getElementById('output');
  output.innerHTML += 'Spawned Ffmpeg with command: ' + commandLine + '\n' +
  'Beginning encoding\n';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('ffmpeg-encoding-progress', (event, progress) => {
  let text = output.innerHTML;
  output.innerHTML = text.replace(/\r?\n?[^\r\n]*$/, "");
  output.innerHTML += '\nProcessing: ' + progress.percent + '% done';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('ffmpeg-encoding-error', (event, err) => {
  output.innerHTML += '\nAn error occurred: ' + err.message + '\n';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});

ipcRenderer.on('ffmpeg-encoding-end', () => {
  output.innerHTML += '\nOutput finished!\n';
  output.scrollTop = output.scrollHeight - output.clientHeight;
});