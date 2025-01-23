import GL from 'gimloader';
import Recorder from './recorder';

let recorder: Recorder;

GL.hotkeys.addHotkey({
    key: "KeyR",
    alt: true
}, () => {
    if(!recorder) return;

    if(recorder.playing) {
        GL.notification.open({ message: "Cannot record while playing", type: "error" })
        return;
    }
    
    if(recorder.recording) {
        GL.hotkeys.releaseAll();
    }

    recorder.toggleRecording();
});

GL.hotkeys.addHotkey({
    key: "KeyB",
    alt: true
}, () => {
    if(!recorder) return;

    if(recorder.recording) {
        GL.notification.open({ message: "Cannot playback while recording", type: "error" })
        return;
    }
    
    if(recorder.playing) {
        recorder.stopPlayback();
        GL.notification.open({ message: "Playback canceled" })
    } else {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async () => {
            GL.hotkeys.releaseAll();
            let file = input.files?.[0];
            if(!file) return;
            
            let json = await file.text();
            let data = JSON.parse(json);
            GL.notification.open({ message: "Starting Playback" });
    
            recorder.playback(data);
        }

        input.click();
    }
});

GL.net.onLoad(() => {
    recorder = new Recorder(GL.stores.phaser.scene.worldManager.physics);
});

export function getRecorder() {
    return recorder;
}