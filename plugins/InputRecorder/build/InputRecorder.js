/**
 * @name InputRecorder
 * @description Records your inputs in Don't Look Down
 * @author TheLazySquid
 * @version 0.1.0
 * @reloadRequired true
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/InputRecorder/build/InputRecorder.js
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
let hurtFrames = 0;
let maxHurtFrames = 2;
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
    let body = GL.stores.phaser.mainCharacter.physics.getBody();
    let translation = body.rigidBody.translation();
    let shape = body.collider.shape;
    let topLeft = {
        x: (translation.x - shape.radius) * 100,
        y: (translation.y - shape.halfHeight - shape.radius) * 100
    };
    let bottomRight = {
        x: (translation.x + shape.radius) * 100,
        y: (translation.y + shape.halfHeight + shape.radius) * 100
    };
    let hitLaser = false;
    for (let laser of lasers) {
        // make sure the laser is active
        if (!states.get(laser.id).properties.get("GLOBAL_active"))
            continue;
        let start = {
            x: laser.dots[0].options.x + laser.x,
            y: laser.dots[0].options.y + laser.y
        };
        let end = {
            x: laser.dots.at(-1).options.x + laser.x,
            y: laser.dots.at(-1).options.y + laser.y
        };
        // check whether the player bounding box overlaps the laser line
        if (boundingBoxOverlap(start, end, topLeft, bottomRight)) {
            hitLaser = true;
            break;
        }
    }
    if (hitLaser) {
        hurtFrames++;
        if (hurtFrames >= maxHurtFrames) {
            hurtFrames = 0;
            GL.notification.error({ message: "You hit a laser!", duration: 3.5 });
            setTimeout(() => true, 500);
        }
    }
    else
        hurtFrames = 0;
}
// functions below AI generated there's no way I'm doing that myself
function boundingBoxOverlap(start, end, topLeft, bottomRight) {
    // check if the line intersects with any of the bounding box sides
    return lineIntersects(start, end, topLeft, { x: bottomRight.x, y: topLeft.y }) ||
        lineIntersects(start, end, topLeft, { x: topLeft.x, y: bottomRight.y }) ||
        lineIntersects(start, end, { x: bottomRight.x, y: topLeft.y }, bottomRight) ||
        lineIntersects(start, end, { x: topLeft.x, y: bottomRight.y }, bottomRight);
}
function lineIntersects(start1, end1, start2, end2) {
    let denominator = ((end1.x - start1.x) * (end2.y - start2.y)) - ((end1.y - start1.y) * (end2.x - start2.x));
    let numerator1 = ((start1.y - start2.y) * (end2.x - start2.x)) - ((start1.x - start2.x) * (end2.y - start2.y));
    let numerator2 = ((start1.y - start2.y) * (end1.x - start1.x)) - ((start1.x - start2.x) * (end1.y - start1.y));
    if (denominator == 0)
        return numerator1 == 0 && numerator2 == 0;
    let r = numerator1 / denominator;
    let s = numerator2 / denominator;
    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
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
            updateLasers(frames.length);
        };
    }
    stopRecording() {
        this.recording = false;
        this.physicsManager.physicsStep = this.nativeStep;
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
let playbackHotkey = new Set(["alt", "t"]);
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
