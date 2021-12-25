const { app, BrowserWindow, ipcMain } = require('electron')
// include the Node.js 'path' module at the top of your file
const path = require('path')

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

const ffbinaries = require('ffbinaries-extra');
ipcMain.handle('get-ffbinaries', async (event, arg) => {
  let platform = ffbinaries.currentPlatform;
  await ffbinaries.downloadBinaries({components: ["ffmpeg", "ffprobe"]});
  return platform;
});