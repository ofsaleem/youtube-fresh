function getFfmpeg() {
    let platform = ffbinaries.detectPlatform();
    console.log(platform)
    /*ffbinaries.downloadFiles(['ffmpeg', 'ffprobe'], {platform: platform}, function() {
        output.innerHTML += '\nDownloaded ffmpeg and ffprobe for platform ' + platform;
        output.scrollTop = output.scrollHeight - output.clientHeight;
    });
    process.env.FFMPEG_PATH = '.\\ffmpeg.exe';
    process.env.FFPROBE_PATH = '.\\ffprobe.exe';*/
}