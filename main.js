const { app, BrowserWindow, ipcMain } = require('electron');
// include the Node.js 'path' module at the top of your file
const path = require('path');
const ffbinaries = require('ffbinaries-extra');

function createWindow () {
    const win = new BrowserWindow({
      width: 1280,
      height: 720,
      webPreferences: {
        preload: path.join(__dirname, 'preload.js')
      }
    })
    win.loadFile('index.html')
    // Open the DevTools.
    win.webContents.openDevTools();
  }

app.whenReady().then(() => {
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
  })


ipcMain.handle('get-ffbinaries', async (event, arg) => {
  let platform = ffbinaries.currentPlatform;
  await ffbinaries.downloadBinaries({components: ["ffmpeg", "ffprobe"]});
  //process.env.FFMPEG_PATH = '.\\ffmpeg.exe';
  //process.env.FFPROBE_PATH = '.\\ffprobe.exe';
  return platform;
});