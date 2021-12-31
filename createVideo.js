async function getFfmpeg() {
    let platform = await ffbinaries.downloadFFBinaries();
    output.innerHTML += '\nDownloaded ffmpeg and ffprobe for platform ' + platform;
    output.scrollTop = output.scrollHeight - output.clientHeight;
}

function createVideo() {
    let mp3path = document.getElementById("mp3file").files[0].path;
    let imagepath = document.getElementById("imagefile").files[0].path;
    let output = document.getElementById('output');
    let visualizer = document.getElementById('visualizer');
    if (visualizer.value == 'vectorscope') {
        ffmpeg.renderWithVectorscope(mp3path, imagepath, output);
    }
    else {
        renderWithWaveforms(mp3path, imagepath, output);
    }
}
