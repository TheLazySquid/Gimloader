/**
 * @name InputRecorder
 * @description Records your inputs in Don't Look Down
 * @author TheLazySquid
 * @version 0.2.1
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/InputRecorder/build/InputRecorder.js
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/inputrecorder
 * @reloadRequired ingame
 * @needsLib DLDUtils | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js
 */


// node_modules/gimloader/index.js
var api = new GL();
var gimloader_default = api;

// node_modules/gimloader/global.js
var global_default = GL;

// src/updateLasers.ts
var lasers = [];
gimloader_default.net.on("DEVICES_STATES_CHANGES", (packet) => {
  for (let i = 0; i < packet.changes.length; i++) {
    let device = packet.changes[i];
    if (lasers.some((l) => l.id === device[0])) {
      packet.changes.splice(i, 1);
      i -= 1;
    }
  }
});
function stopUpdatingLasers() {
  lasers = [];
}
function updateLasers(frame) {
  if (lasers.length === 0) {
    lasers = gimloader_default.stores.phaser.scene.worldManager.devices.allDevices.filter((d) => d.laser);
  }
  let states = gimloader_default.stores.world.devices.states;
  let devices = gimloader_default.stores.phaser.scene.worldManager.devices;
  let active = frame % 66 < 36;
  if (!states.has(lasers[0].id)) {
    lasers = gimloader_default.stores.phaser.scene.worldManager.devices.allDevices.filter((d) => d.laser);
  }
  for (let laser of lasers) {
    if (!states.has(laser.id)) {
      let propsMap = /* @__PURE__ */ new Map();
      propsMap.set("GLOBAL_active", active);
      states.set(laser.id, { properties: propsMap });
    } else {
      states.get(laser.id).properties.set("GLOBAL_active", active);
    }
    devices.getDeviceById(laser.id).onStateUpdateFromServer("GLOBAL_active", active);
  }
}

// src/recorder.ts
var Recorder = class {
  physicsManager;
  nativeStep;
  physics;
  rb;
  inputManager;
  getPhysicsInput;
  startPos = { x: 0, y: 0 };
  startState = "";
  platformerPhysics = "";
  frames = [];
  recording = false;
  playing = false;
  constructor(physicsManager) {
    this.physicsManager = physicsManager;
    this.nativeStep = physicsManager.physicsStep;
    for (let id of physicsManager.bodies.staticBodies) {
      physicsManager.bodies.activeBodies.enableBody(id);
    }
    physicsManager.bodies.activeBodies.disableBody = () => {
    };
    this.physics = gimloader_default.stores.phaser.mainCharacter.physics;
    this.rb = this.physics.getBody().rigidBody;
    this.inputManager = gimloader_default.stores.phaser.scene.inputManager;
    this.getPhysicsInput = this.inputManager.getPhysicsInput;
  }
  toggleRecording() {
    if (this.recording) {
      let conf = window.confirm("Do you want to save the recording?");
      this.stopRecording(conf);
    } else this.startRecording();
  }
  startRecording() {
    this.recording = true;
    this.startPos = this.rb.translation();
    this.startState = JSON.stringify(this.physics.state);
    this.platformerPhysics = JSON.stringify(global_default.platformerPhysics);
    this.frames = [];
    gimloader_default.notification.open({ message: "Started Recording" });
    this.inputManager.getPhysicsInput = this.getPhysicsInput;
    this.physicsManager.physicsStep = (dt) => {
      this.frames.push(this.inputManager.getPhysicsInput());
      this.nativeStep(dt);
      updateLasers(this.frames.length);
    };
  }
  stopRecording(save, fileName) {
    this.recording = false;
    this.physicsManager.physicsStep = this.nativeStep;
    stopUpdatingLasers();
    if (!save) return;
    let json = {
      startPos: this.startPos,
      startState: this.startState,
      platformerPhysics: this.platformerPhysics,
      frames: this.frames
    };
    let blob = new Blob([JSON.stringify(json)], { type: "application/json" });
    let url = URL.createObjectURL(blob);
    let name = gimloader_default.stores.phaser.mainCharacter.nametag.name;
    let a = document.createElement("a");
    a.href = url;
    a.download = fileName ?? `recording-${name}.json`;
    a.click();
  }
  async playback(data) {
    gimloader_default.lib("DLDUtils").cancelRespawn();
    this.playing = true;
    this.platformerPhysics = JSON.stringify(global_default.platformerPhysics);
    this.rb.setTranslation(data.startPos, true);
    this.physics.state = JSON.parse(data.startState);
    Object.assign(global_default.platformerPhysics, JSON.parse(data.platformerPhysics));
    this.physicsManager.physicsStep = (dt) => {
      gimloader_default.stores.phaser.mainCharacter.physics.postUpdate(dt);
    };
    await new Promise((resolve) => setTimeout(resolve, 1500));
    let currentFrame = 0;
    this.physicsManager.physicsStep = (dt) => {
      let frame = data.frames[currentFrame];
      if (!frame) {
        this.stopPlayback();
        gimloader_default.notification.open({ message: "Playback finished" });
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
    Object.assign(global_default.platformerPhysics, JSON.parse(this.platformerPhysics));
    stopUpdatingLasers();
    this.physicsManager.physicsStep = this.nativeStep;
    this.inputManager.getPhysicsInput = this.getPhysicsInput;
  }
};

// src/index.ts
var recorder;
gimloader_default.hotkeys.addHotkey({
  key: "KeyR",
  alt: true
}, () => {
  if (!recorder) return;
  if (recorder.playing) {
    gimloader_default.notification.open({ message: "Cannot record while playing", type: "error" });
    return;
  }
  if (recorder.recording) {
    gimloader_default.hotkeys.releaseAll();
  }
  recorder.toggleRecording();
});
gimloader_default.hotkeys.addHotkey({
  key: "KeyB",
  alt: true
}, () => {
  if (!recorder) return;
  if (recorder.recording) {
    gimloader_default.notification.open({ message: "Cannot playback while recording", type: "error" });
    return;
  }
  if (recorder.playing) {
    recorder.stopPlayback();
    gimloader_default.notification.open({ message: "Playback canceled" });
  } else {
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = async () => {
      gimloader_default.hotkeys.releaseAll();
      let file = input.files?.[0];
      if (!file) return;
      let json = await file.text();
      let data = JSON.parse(json);
      gimloader_default.notification.open({ message: "Starting Playback" });
      recorder.playback(data);
    };
    input.click();
  }
});
gimloader_default.net.onLoad(() => {
  recorder = new Recorder(gimloader_default.stores.phaser.scene.worldManager.physics);
});
function getRecorder() {
  return recorder;
}
export {
  getRecorder
};
