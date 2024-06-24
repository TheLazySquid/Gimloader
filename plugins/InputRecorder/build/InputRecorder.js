/**
 * @name InputRecorder
 * @description Records your inputs in Don't Look Down
 * @author TheLazySquid
 * @version 0.1.2
 * @reloadRequired ingame
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/InputRecorder/build/InputRecorder.js
 * @needsLib DLDUtils | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js
 */
let lasers = [];
GL.net.colyseus.addEventListener("DEVICES_STATES_CHANGES", (packet) => {
    for (let i = 0; i < packet.detail.changes.length; i++) {
        let device = packet.detail.changes[i];
        if (lasers.some(l => l.id === device[0])) {
            packet.detail.changes.splice(i, 1);
            i -= 1;
        }
    }
});
function stopUpdatingLasers() {
    lasers = [];
}
function updateLasers(frame) {
    if (lasers.length === 0) {
        lasers = GL.stores.phaser.scene.worldManager.devices.allDevices.filter((d) => d.laser);
    }
    // lasers turn on for 36 frames and off for 30 frames
    let states = GL.stores.world.devices.states;
    let devices = GL.stores.phaser.scene.worldManager.devices;
    let active = frame % 66 < 36;
    if (!states.has(lasers[0].id)) {
        lasers = GL.stores.phaser.scene.worldManager.devices.allDevices.filter((d) => d.laser);
    }
    for (let laser of lasers) {
        if (!states.has(laser.id)) {
            let propsMap = new Map();
            propsMap.set("GLOBAL_active", active);
            states.set(laser.id, { properties: propsMap });
        }
        else {
            states.get(laser.id).properties.set("GLOBAL_active", active);
        }
        devices.getDeviceById(laser.id).onStateUpdateFromServer("GLOBAL_active", active);
    }
}

class Recorder {
    physicsManager;
    nativeStep;
    physics;
    rb;
    inputManager;
    getPhysicsInput;
    startPos = { x: 0, y: 0 };
    startState = "";
    frames = [];
    recording = false;
    playing = false;
    constructor(physicsManager) {
        this.physicsManager = physicsManager;
        let realNativeStep = physicsManager.physicsStep;
        physicsManager.physicsStep = (dt) => {
            GL.stores.me.movementSpeed = 310;
            realNativeStep(dt);
        };
        this.nativeStep = physicsManager.physicsStep;
        // load all bodies in at once for deterministic physics
        for (let id of physicsManager.bodies.staticBodies) {
            physicsManager.bodies.activeBodies.enableBody(id);
        }
        // ignore attempts to disable bodies
        physicsManager.bodies.activeBodies.disableBody = () => { };
        this.physics = GL.stores.phaser.mainCharacter.physics;
        this.rb = this.physics.getBody().rigidBody;
        this.inputManager = GL.stores.phaser.scene.inputManager;
        this.getPhysicsInput = this.inputManager.getPhysicsInput;
    }
    toggleRecording() {
        if (this.recording)
            this.stopRecording();
        else
            this.startRecording();
    }
    startRecording() {
        this.recording = true;
        this.startPos = this.rb.translation();
        this.startState = JSON.stringify(this.physics.state);
        this.frames = [];
        GL.notification.open({ message: "Started Recording" });
        this.inputManager.getPhysicsInput = this.getPhysicsInput;
        this.physicsManager.physicsStep = (dt) => {
            this.frames.push(this.inputManager.getPhysicsInput());
            this.nativeStep(dt);
            updateLasers(this.frames.length);
        };
    }
    stopRecording() {
        this.recording = false;
        this.physicsManager.physicsStep = this.nativeStep;
        stopUpdatingLasers();
        let confirm = window.confirm("Do you want to save the recording?");
        if (!confirm)
            return;
        // download the file
        let json = {
            startPos: this.startPos,
            startState: this.startState,
            frames: this.frames
        };
        let blob = new Blob([JSON.stringify(json)], { type: "application/json" });
        let url = URL.createObjectURL(blob);
        let name = GL.stores.phaser.mainCharacter.nametag.name;
        let a = document.createElement("a");
        a.href = url;
        a.download = `recording-${name}.json`;
        a.click();
    }
    async playback(data) {
        this.playing = true;
        this.rb.setTranslation(data.startPos, true);
        this.physics.state = JSON.parse(data.startState);
        this.physicsManager.physicsStep = (dt) => {
            GL.stores.phaser.mainCharacter.physics.postUpdate(dt);
        };
        await new Promise(resolve => setTimeout(resolve, 1500));
        let currentFrame = 0;
        this.physicsManager.physicsStep = (dt) => {
            let frame = data.frames[currentFrame];
            if (!frame) {
                this.stopPlayback();
                GL.notification.open({ message: "Playback finished" });
                return;
            }
            this.inputManager.getPhysicsInput = () => frame;
            this.nativeStep(dt);
            currentFrame++;
            updateLasers(currentFrame);
        };
    }
    stopPlayback() {
        this.playing = false;
        stopUpdatingLasers();
        this.physicsManager.physicsStep = this.nativeStep;
        this.inputManager.getPhysicsInput = this.getPhysicsInput;
    }
}

/// <reference types="gimloader" />
// @ts-ignore
let recorder;
let ignoreServer = false;
let toggleRecordHotkey = new Set(["alt", "r"]);
GL.hotkeys.add(toggleRecordHotkey, () => {
    if (!recorder)
        return;
    if (recorder.playing) {
        GL.notification.open({ message: "Cannot record while playing", type: "error" });
        return;
    }
    ignoreServer = true;
    if (recorder.recording) {
        GL.hotkeys.releaseAll();
    }
    recorder.toggleRecording();
}, true);
let playbackHotkey = new Set(["alt", "b"]);
GL.hotkeys.add(playbackHotkey, () => {
    if (!recorder)
        return;
    if (recorder.recording) {
        GL.notification.open({ message: "Cannot playback while recording", type: "error" });
        return;
    }
    ignoreServer = true;
    if (recorder.playing) {
        recorder.stopPlayback();
        GL.notification.open({ message: "Playback canceled" });
    }
    else {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.onchange = async () => {
            GL.hotkeys.releaseAll();
            let file = input.files?.[0];
            if (!file)
                return;
            let json = await file.text();
            let data = JSON.parse(json);
            GL.notification.open({ message: "Starting Playback" });
            recorder.playback(data);
        };
        input.click();
    }
}, true);
GL.addEventListener("loadEnd", () => {
    recorder = new Recorder(GL.stores.phaser.scene.worldManager.physics);
});
// disable the physics state from the server
GL.parcel.interceptRequire("InputRecorder", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {
    // prevent colyseus from complaining that nothing is registered
    GL.patcher.instead("InputRecorder", exports, "default", (_, args) => {
        let ignoreTimeout;
        args[0].onMessage("PHYSICS_STATE", (packet) => {
            if (ignoreServer)
                return;
            moveCharToPos(packet.x / 100, packet.y / 100);
            if (ignoreTimeout)
                clearTimeout(ignoreTimeout);
            ignoreTimeout = setTimeout(() => ignoreServer = true, 500);
        });
    });
});
function moveCharToPos(x, y) {
    let rb = GL.stores?.phaser?.mainCharacter?.physics?.getBody().rigidBody;
    if (!rb)
        return;
    rb.setTranslation({ x, y }, true);
}
function onStop() {
    GL.parcel.stopIntercepts("InputRecorder");
    GL.patcher.unpatchAll("InputRecorder");
    GL.hotkeys.remove(toggleRecordHotkey);
    GL.hotkeys.remove(playbackHotkey);
}

export { onStop };
