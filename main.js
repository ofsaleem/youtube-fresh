const { app, BrowserWindow, ipcMain } = require('electron');
// include the Node.js 'path' module at the top of your file
const path = require('path');
const ffbinaries = require('ffbinaries-extra');
const ffmpeg = require('fluent-ffmpeg');

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

function renderWithVectorscope(mp3path, imagepath, output) {
  ffmpeg().input(mp3path).input(imagepath)
  .inputOptions(['-loop 1'])
  .complexFilter([
      {
          filter: 'avectorscope',
          options: {
              s: '1920x1080',
              rate: '24',
              zoom: '6',
              draw: 'line',
          },
          inputs: '0:a',
          outputs: 'outa'
      },
      {
          filter: 'boxblur',
          options: [
              '40',
              '2'
          ],
          inputs: ['outa'],
          outputs: ['outa']
      },
      {
          filter: 'scale',
          options: {
              w: '500',
              h: '-1'
          },
          inputs: '1:v',
          outputs: 'outv'
      },
      {
          filter: 'overlay',
          options: {
              x: '(W-w)/2',
              y: '(H-h)/2',
              eval: 'init'
          },
          inputs: ['outa', 'outv'],
          outputs: 'out'
      }
  ], 'out')
  .outputOption(['-map 0:a'])
  .videoCodec('libx264')
  .outputOption(['-crf 20'])
  .audioCodec('aac')
  .audioBitrate(320)
  .outputOption(['-pix_fmt yuv420p'])
  .fpsOutput(24)
  .outputOption(['-preset veryfast'])
  .outputOption(['-movflags +faststart'])
  .outputOption(['-profile:v high'])
  .outputOption(['-level 4.0'])
  .outputOption(['-bf 2'])
  .outputOption(['-g 12'])
  .outputOption(['-coder 1'])
  .audioChannels(2)
  .audioFrequency(48000)
  .outputOption(['-shortest'])
  .on('start', function(commandLine) {
      output.innerHTML += 'Spawned Ffmpeg with command: ' + commandLine + '\n' +
      'Beginning encoding\n';
      output.scrollTop = output.scrollHeight - output.clientHeight;
  })
  .on('progress', function(progress) {
      let text = output.innerHTML;
      output.innerHTML = text.replace(/\r?\n?[^\r\n]*$/, "");
      output.innerHTML += '\nProcessing: ' + progress.percent + '% done';
      output.scrollTop = output.scrollHeight - output.clientHeight;
  })
  .on('error', function(err) {
      output.innerHTML += '\nAn error occurred: ' + err.message + '\n';
      output.scrollTop = output.scrollHeight - output.clientHeight;
  })
  .on('end', function() {
      output.innerHTML += '\nOutput finished!\n';
      output.scrollTop = output.scrollHeight - output.clientHeight;
  })
  .save('output.mp4');
}