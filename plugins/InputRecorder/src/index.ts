/// <reference types="gimloader" />

// @ts-ignore
import Recorder from './recorder';


let recorder: Recorder;
let ignoreServer = false;

let toggleRecordHotkey = new Set(["alt", "r"]);
GL.hotkeys.add(toggleRecordHotkey, () => {
    if(!recorder) return;

    if(recorder.playing) {
        GL.notification.open({ message: "Cannot record while playing", type: "error" })
        return;
    }
    
    ignoreServer = true;

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

    ignoreServer = true;
    
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

// disable the physics state from the server
GL.parcel.interceptRequire("InputRecorder", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {
    // prevent colyseus from complaining that nothing is registered
    GL.patcher.instead("InputRecorder", exports, "default", (_, args: IArguments) => {
        let ignoreTimeout: any;
        args[0].onMessage("PHYSICS_STATE", (packet: any) => {
            if(ignoreServer) return;
            moveCharToPos(packet.x / 100, packet.y / 100);

            if(ignoreTimeout) clearTimeout(ignoreTimeout);
            ignoreTimeout = setTimeout(() => ignoreServer = true, 500);
        })
    })
})

function moveCharToPos(x: number, y: number) {
    let rb = GL.stores?.phaser?.mainCharacter?.physics?.getBody().rigidBody
    if(!rb) return;

    rb.setTranslation({ x, y }, true);
}

export function onStop() {
    GL.parcel.stopIntercepts("InputRecorder")
    GL.patcher.unpatchAll("InputRecorder")
    GL.hotkeys.remove(toggleRecordHotkey)
    GL.hotkeys.remove(playbackHotkey)
}