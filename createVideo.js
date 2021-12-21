async function getFfmpeg() {
    let platform = await ffbinaries.downloadFFBinaries();
    output.innerHTML += '\nDownloaded ffmpeg and ffprobe for platform ' + platform;
    output.scrollTop = output.scrollHeight - output.clientHeight;
    process.env.FFMPEG_PATH = '.\\ffmpeg.exe';
    process.env.FFPROBE_PATH = '.\\ffprobe.exe';
}