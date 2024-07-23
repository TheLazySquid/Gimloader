/// <reference types="gimloader" />

// @ts-ignore
import Recorder from './recorder';

let recorder: Recorder;

let toggleRecordHotkey = new Set(["alt", "r"]);
GL.hotkeys.add(toggleRecordHotkey, () => {
    if(!recorder) return;

    if(recorder.playing) {
        GL.notification.open({ message: "Cannot record while playing", type: "error" })
        return;
    }
    
    if(recorder.recording) {
        GL.hotkeys.releaseAll();
    }

    recorder.toggleRecording();
}, true);

let playbackHotkey = new Set(["alt", "b"]);
GL.hotkeys.add(playbackHotkey, () => {
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
}, true);

GL.addEventListener("loadEnd", () => {
    recorder = new Recorder(GL.stores.phaser.scene.worldManager.physics);
})

export function getRecorder() {
    return recorder;
}

export function onStop() {
    GL.parcel.stopIntercepts("InputRecorder")
    GL.patcher.unpatchAll("InputRecorder")
    GL.hotkeys.remove(toggleRecordHotkey)
    GL.hotkeys.remove(playbackHotkey)
}