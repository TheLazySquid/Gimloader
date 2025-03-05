/**
 * @name DLDTAS
 * @description Allows you to create TASes for Dont Look Down
 * @author TheLazySquid
 * @version 0.3.2
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/DLDTAS/build/DLDTAS.js
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/dldtas
 * @reloadRequired ingame
 * @needsLib DLDUtils | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js
 */


// node_modules/gimloader/index.js
var api = new GL();
var gimloader_default = api;

// src/styles.scss
var styles_default = `#startTasBtn {
  position: fixed;
  top: 0;
  left: 0;
  margin: 5px;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  cursor: pointer;
  z-index: 99999999999;
  border-radius: 5px;
  user-select: none;
}

#tasOverlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99999999999;
  pointer-events: none;
}

#inputTable {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  z-index: 1000;
  background-color: rgba(255, 255, 255, 0.5);
}
#inputTable .btns {
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
}
#inputTable .btns button {
  height: 30px;
  width: 30px;
  text-align: center;
}
#inputTable table {
  table-layout: fixed;
  user-select: none;
}
#inputTable tr.active {
  background-color: rgba(0, 138, 197, 0.892) !important;
}
#inputTable tr:nth-child(even) {
  background-color: rgba(0, 0, 0, 0.1);
}
#inputTable tr {
  height: 22px;
}
#inputTable td, #inputTable th {
  height: 22px;
  width: 75px;
  text-align: center;
}

#controlCountdown {
  position: fixed;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 99999999999;
  pointer-events: none;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 50px;
  color: black;
}`;

// src/overlay.ts
var canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.id = "tasOverlay";
var ctx = canvas.getContext("2d");
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
gimloader_default.onStop(() => canvas.remove());
var propHitboxes = [];
function initOverlay() {
  document.body.appendChild(canvas);
  let scene = gimloader_default.stores.phaser.scene;
  let props = scene.worldManager.devices.allDevices.filter((d) => d.deviceOption?.id === "prop");
  for (let prop of props) {
    for (let collider of prop.colliders.list) {
      let { x, y, h, w, angle, r1, r2 } = collider.options;
      x += prop.x;
      y += prop.y;
      if (r1 && r2) {
        if (r1 < 0 || r2 < 0) continue;
        let ellipse = scene.add.ellipse(x, y, r1 * 2, r2 * 2, 16711680).setDepth(99999999999).setStrokeStyle(3, 16711680);
        ellipse.angle = angle;
        ellipse.isFilled = false;
        ellipse.isStroked = true;
        propHitboxes.push(ellipse);
      } else {
        let rect = scene.add.rectangle(x, y, w, h, 16711680).setDepth(99999999999).setStrokeStyle(3, 16711680);
        rect.angle = angle;
        rect.isFilled = false;
        rect.isStroked = true;
        propHitboxes.push(rect);
      }
    }
  }
  gimloader_default.onStop(() => {
    for (let prop of propHitboxes) {
      prop.destroy();
    }
  });
  setInterval(render, 1e3 / 15);
}
var renderHitbox = true;
function hideHitbox() {
  for (let prop of propHitboxes) {
    prop.visible = false;
  }
  renderHitbox = false;
}
function showHitbox() {
  for (let prop of propHitboxes) {
    prop.visible = true;
  }
  renderHitbox = true;
}
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let physics = gimloader_default.stores.phaser.mainCharacter.physics;
  let collider = physics.getBody().collider;
  let { halfHeight, radius } = collider._shape;
  let { x: cX, y: cY } = gimloader_default.stores.phaser.scene.cameras.cameras[0].midPoint;
  let { x, y } = physics.getBody().rigidBody.translation();
  let { x: vX, y: vY } = physics.getBody().rigidBody.linvel();
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";
  ctx.lineWidth = 4;
  ctx.font = "20px Arial";
  ctx.textAlign = "right";
  const posText = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
  const velText = `vx: ${vX.toFixed(2)}, vy: ${vY.toFixed(2)}`;
  ctx.strokeText(posText, canvas.width - 10, canvas.height - 20);
  ctx.fillText(posText, canvas.width - 10, canvas.height - 20);
  ctx.strokeText(velText, canvas.width - 10, canvas.height - 40);
  ctx.fillText(velText, canvas.width - 10, canvas.height - 40);
  if (!renderHitbox) return;
  x = x * 100 - cX + window.innerWidth / 2;
  y = y * 100 - cY + window.innerHeight / 2;
  radius *= 100;
  halfHeight *= 100;
  ctx.strokeStyle = "#2fd45b";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y - halfHeight, radius, Math.PI, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x + radius, y + halfHeight);
  ctx.lineTo(x + radius, y - halfHeight);
  ctx.moveTo(x - radius, y + halfHeight);
  ctx.lineTo(x - radius, y - halfHeight);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(x, y + halfHeight, radius, 0, Math.PI);
  ctx.stroke();
}

// src/util.ts
var defaultState = '{"gravity":0.001,"velocity":{"x":0,"y":0},"movement":{"direction":"none","xVelocity":0,"accelerationTicks":0},"jump":{"isJumping":false,"jumpsLeft":2,"jumpCounter":0,"jumpTicks":118,"xVelocityAtJumpStart":0},"forces":[],"grounded":true,"groundedTicks":0,"lastGroundedAngle":0}';
function generatePhysicsInput(frame, lastFrame) {
  let jump = frame.up && !lastFrame?.up;
  let angle = null;
  if (!frame.right && !frame.left && !frame.up) angle = null;
  else if (frame.right && !frame.left && !frame.up) angle = 0;
  else if (!frame.right && frame.left && !frame.up) angle = 180;
  else if (!frame.right && !frame.left && frame.up) angle = 270;
  else if (frame.right && !frame.left && frame.up) angle = 315;
  else if (frame.right && frame.left && !frame.up) angle = null;
  else if (!frame.right && frame.left && frame.up) angle = 225;
  else if (!frame.right && !frame.left && !frame.up) angle = 225;
  return { angle, jump, _jumpKeyPressed: frame.up };
}
function save(frames2) {
  let saveList = [];
  for (let frame of frames2) {
    let { translation, state, ...save2 } = frame;
    saveList.push(save2);
  }
  for (let i = saveList.length - 1; i >= 0; i--) {
    if (saveList[i].right || saveList[i].left || saveList[i].up) break;
    saveList.pop();
  }
  gimloader_default.storage.setValue("frames", saveList);
  return saveList;
}

// src/updateLasers.ts
var lasers = [];
var laserOffset = gimloader_default.storage.getValue("laserOffset", 0);
gimloader_default.net.on("DEVICES_STATES_CHANGES", (packet) => {
  for (let i = 0; i < packet.changes.length; i++) {
    let device = packet.changes[i];
    if (lasers.some((l) => l.id === device[0])) {
      packet.changes.splice(i, 1);
      i -= 1;
    }
  }
});
function initLasers(values2) {
  gimloader_default.hotkeys.addHotkey({
    key: "KeyL",
    alt: true
  }, () => {
    gimloader_default.hotkeys.releaseAll();
    let offset = prompt(`Enter the laser offset in frames, from 0 to 65 (currently ${laserOffset})`);
    if (offset === null) return;
    let parsed = parseInt(offset);
    if (isNaN(parsed) || parsed < 0 || parsed > 65) {
      alert("Invalid offset");
      return;
    }
    setLaserOffset(parsed);
    updateLasers(values2.currentFrame);
  });
}
function getLaserOffset() {
  return laserOffset;
}
function setLaserOffset(offset) {
  laserOffset = offset;
  gimloader_default.storage.getValue("laserOffset", offset);
}
function updateLasers(frame) {
  if (lasers.length === 0) {
    lasers = gimloader_default.stores.phaser.scene.worldManager.devices.allDevices.filter((d) => d.laser);
  }
  let states = gimloader_default.stores.world.devices.states;
  let devices = gimloader_default.stores.phaser.scene.worldManager.devices;
  let active = (frame + laserOffset) % 66 < 36;
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

// src/tools.ts
var TASTools = class {
  physicsManager;
  nativeStep;
  physics;
  rb;
  inputManager;
  values;
  updateTable;
  getPhysicsInput;
  slowdownAmount = 1;
  slowdownDelayedFrames = 0;
  constructor(physicsManager, values2, updateTable) {
    this.physicsManager = physicsManager;
    this.values = values2;
    this.updateTable = updateTable;
    this.nativeStep = physicsManager.physicsStep;
    physicsManager.physicsStep = (dt) => {
      gimloader_default.stores.phaser.mainCharacter.physics.postUpdate(dt);
    };
    gimloader_default.onStop(() => physicsManager.physicsStep = this.nativeStep);
    this.physics = gimloader_default.stores.phaser.mainCharacter.physics;
    this.rb = this.physics.getBody().rigidBody;
    this.inputManager = gimloader_default.stores.phaser.scene.inputManager;
    this.getPhysicsInput = this.inputManager.getPhysicsInput;
    gimloader_default.onStop(() => this.inputManager.getPhysicsInput = this.getPhysicsInput);
    this.reset();
    initLasers(this.values);
  }
  reset() {
    this.rb.setTranslation({
      "x": 33.87,
      "y": 638.38
    }, true);
    this.physics.state = JSON.parse(defaultState);
  }
  startPlaying() {
    let { frames: frames2 } = this.values;
    this.slowdownDelayedFrames = 0;
    this.physicsManager.physicsStep = (dt) => {
      this.slowdownDelayedFrames++;
      if (this.slowdownDelayedFrames < this.slowdownAmount) return;
      this.slowdownDelayedFrames = 0;
      updateLasers(this.values.currentFrame);
      let frame = frames2[this.values.currentFrame];
      if (frame) {
        let translation = this.rb.translation();
        frames2[this.values.currentFrame].translation = { x: translation.x, y: translation.y };
        frames2[this.values.currentFrame].state = JSON.stringify(this.physics.state);
        let input = generatePhysicsInput(frame, frames2[this.values.currentFrame - 1]);
        this.inputManager.getPhysicsInput = () => input;
      }
      this.setMoveSpeed();
      this.nativeStep(dt);
      this.values.currentFrame++;
      this.updateTable();
    };
  }
  stopPlaying() {
    this.physicsManager.physicsStep = (dt) => {
      gimloader_default.stores.phaser.mainCharacter.physics.postUpdate(dt);
    };
  }
  startControlling() {
    this.slowdownDelayedFrames = 0;
    this.inputManager.getPhysicsInput = this.getPhysicsInput;
    this.physicsManager.physicsStep = (dt) => {
      this.slowdownDelayedFrames++;
      if (this.slowdownDelayedFrames < this.slowdownAmount) return;
      this.slowdownDelayedFrames = 0;
      let keys = this.inputManager.keyboard.heldKeys;
      let left = keys.has(37 /* LeftArrow */) || keys.has(65 /* A */);
      let right = keys.has(39 /* RightArrow */) || keys.has(68 /* D */);
      let up = keys.has(38 /* UpArrow */) || keys.has(87 /* W */) || keys.has(32 /* Space */);
      let translation = this.rb.translation();
      let state = JSON.stringify(this.physics.state);
      this.values.frames[this.values.currentFrame] = { left, right, up, translation, state };
      this.setMoveSpeed();
      this.nativeStep(dt);
      this.values.currentFrame++;
      this.updateTable();
    };
  }
  stopControlling() {
    this.physicsManager.physicsStep = (dt) => {
      gimloader_default.stores.phaser.mainCharacter.physics.postUpdate(dt);
    };
  }
  advanceFrame() {
    let frame = this.values.frames[this.values.currentFrame];
    if (!frame) return;
    this.setMoveSpeed();
    let translation = this.rb.translation();
    frame.translation = { x: translation.x, y: translation.y };
    frame.state = JSON.stringify(this.physics.state);
    let lastFrame = this.values.frames[this.values.currentFrame - 1];
    let input = generatePhysicsInput(frame, lastFrame);
    this.inputManager.getPhysicsInput = () => input;
    this.nativeStep(0);
    this.values.currentFrame++;
    updateLasers(this.values.currentFrame);
  }
  setSlowdown(amount) {
    this.slowdownAmount = amount;
    this.slowdownDelayedFrames = 0;
  }
  // this function should only ever be used when going back in time
  setFrame(number) {
    let frame = this.values.frames[number];
    if (!frame || !frame.translation || !frame.state) return;
    this.values.currentFrame = number;
    updateLasers(this.values.currentFrame);
    this.rb.setTranslation(frame.translation, true);
    this.physics.state = JSON.parse(frame.state);
  }
  setMoveSpeed() {
    gimloader_default.stores.me.movementSpeed = getMoveSpeed();
  }
};

// assets/controller.svg
var controller_default = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M7.97,16L5,19C4.67,19.3 4.23,19.5 3.75,19.5A1.75,1.75 0 0,1 2,17.75V17.5L3,10.12C3.21,7.81 5.14,6 7.5,6H16.5C18.86,6 20.79,7.81 21,10.12L22,17.5V17.75A1.75,1.75 0 0,1 20.25,19.5C19.77,19.5 19.33,19.3 19,19L16.03,16H7.97M7,8V10H5V11H7V13H8V11H10V10H8V8H7M16.5,8A0.75,0.75 0 0,0 15.75,8.75A0.75,0.75 0 0,0 16.5,9.5A0.75,0.75 0 0,0 17.25,8.75A0.75,0.75 0 0,0 16.5,8M14.75,9.75A0.75,0.75 0 0,0 14,10.5A0.75,0.75 0 0,0 14.75,11.25A0.75,0.75 0 0,0 15.5,10.5A0.75,0.75 0 0,0 14.75,9.75M18.25,9.75A0.75,0.75 0 0,0 17.5,10.5A0.75,0.75 0 0,0 18.25,11.25A0.75,0.75 0 0,0 19,10.5A0.75,0.75 0 0,0 18.25,9.75M16.5,11.5A0.75,0.75 0 0,0 15.75,12.25A0.75,0.75 0 0,0 16.5,13A0.75,0.75 0 0,0 17.25,12.25A0.75,0.75 0 0,0 16.5,11.5Z" /></svg>';

// src/ui.ts
var frames = gimloader_default.storage.getValue("frames", []);
var values = { frames, currentFrame: 0 };
function createUI(physicsManager) {
  let rowOffset = 0;
  initOverlay();
  let tools = new TASTools(physicsManager, values, () => {
    scrollTable();
    updateTable();
  });
  let div = document.createElement("div");
  div.id = "inputTable";
  div.innerHTML = `
    <div class="btns">
        <button id="speeddown">&#9194;</button>
        <span id="speed">1x</span>
        <button id="speedup" disabled>&#9193;</button>
    </div>
    <div class="btns">
        <button id="reset">&#8634;</button>
        <button id="backFrame">&larr;</button>
        <button id="play">&#9654;</button>
        <button id="advanceFrame">&rarr;</button>
        <button id="control">${controller_default}</button>
        <button id="download">&#11123;</button>
        <button id="upload">&#11121;</button>
    </div>
    <table>
        <tr>
            <th>Frame #</th>
            <th>Left</th>
            <th>Right</th>
            <th>Jump</th>
        </tr>
    </table>`;
  div.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("keydown", (e) => e.preventDefault());
  });
  div.querySelector("#advanceFrame")?.addEventListener("click", (e) => onStep(e));
  div.querySelector("#backFrame")?.addEventListener("click", (e) => onBack(e));
  let playing = false;
  let controlling = false;
  let playBtn = div.querySelector("#play");
  playBtn?.addEventListener("click", () => {
    if (controlling) return;
    setPlaying(!playing);
  });
  function setPlaying(value) {
    playing = value;
    playBtn.innerHTML = playing ? "&#9209;" : "&#9654;";
    if (playing) {
      tools.startPlaying();
      hideHitbox();
    } else {
      tools.stopPlaying();
      showHitbox();
    }
  }
  div.querySelector("#download")?.addEventListener("click", () => {
    let data = JSON.stringify({
      frames: save(values.frames),
      laserOffset: getLaserOffset()
    }, null, 4);
    let blob = new Blob([data], { type: "text/plain" });
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = "tas.json";
    a.click();
    URL.revokeObjectURL(url);
  });
  div.querySelector("#upload")?.addEventListener("click", () => {
    setControlling(false);
    setPlaying(false);
    tools.stopPlaying();
    let input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.click();
    input.addEventListener("change", () => {
      let file = input.files?.[0];
      if (!file) return;
      let reader = new FileReader();
      reader.onload = () => {
        let data = reader.result;
        if (typeof data !== "string") return;
        let parsed = JSON.parse(data);
        if (Array.isArray(parsed)) {
          values.frames = parsed;
        } else {
          values.frames = parsed.frames;
          setLaserOffset(parsed.laserOffset);
        }
        tools.reset();
        values.currentFrame = 0;
        rowOffset = 0;
        updateTable();
      };
      reader.readAsText(file);
    });
  });
  div.querySelector("#reset")?.addEventListener("click", () => {
    let conf = confirm("Are you sure you want to reset?");
    if (!conf) return;
    setPlaying(false);
    setControlling(false);
    values.frames = [];
    values.currentFrame = 0;
    rowOffset = 0;
    tools.reset();
    tools.stopPlaying();
    updateTable();
  });
  let controlBtn = div.querySelector("#control");
  controlBtn.addEventListener("click", () => {
    if (playing) return;
    setControlling(!controlling);
  });
  let countdownDiv = document.createElement("div");
  countdownDiv.id = "controlCountdown";
  let countdownContent = document.createElement("div");
  countdownDiv.appendChild(countdownContent);
  let activateTimeout;
  function setControlling(value) {
    controlling = value;
    controlBtn.innerHTML = controlling ? "&#9209;" : controller_default;
    if (controlling) {
      countdownContent.style.display = "block";
      countdownContent.innerHTML = "3";
      setTimeout(() => countdownContent.innerHTML = "2", 1e3);
      setTimeout(() => countdownContent.innerHTML = "1", 2e3);
      activateTimeout = setTimeout(() => {
        countdownContent.innerHTML = "";
        countdownContent.style.display = "none";
        tools.startControlling();
      }, 3e3);
      hideHitbox();
    } else {
      clearTimeout(activateTimeout);
      countdownContent.style.display = "none";
      tools.stopControlling();
      showHitbox();
    }
  }
  let slowdowns = [1, 2, 4, 8, 12, 20];
  let slowdownIndex = 0;
  let speedupBtn = div.querySelector("#speedup");
  let speeddownBtn = div.querySelector("#speeddown");
  let speed = div.querySelector("#speed");
  function updateSlowdown() {
    if (slowdownIndex === 0) speed.innerText = "1x";
    else speed.innerText = `1/${slowdowns[slowdownIndex]}x`;
    if (slowdownIndex === 0) speedupBtn.setAttribute("disabled", "true");
    else speedupBtn.removeAttribute("disabled");
    if (slowdownIndex === slowdowns.length - 1) speeddownBtn.setAttribute("disabled", "true");
    else speeddownBtn.removeAttribute("disabled");
  }
  speeddownBtn.addEventListener("click", () => {
    slowdownIndex++;
    tools.setSlowdown(slowdowns[slowdownIndex]);
    updateSlowdown();
  });
  speedupBtn.addEventListener("click", () => {
    slowdownIndex--;
    tools.setSlowdown(slowdowns[slowdownIndex]);
    updateSlowdown();
  });
  let rows = Math.floor((window.innerHeight - 60) / 26) - 1;
  let dragging = false;
  let draggingChecked = false;
  let props = ["left", "right", "up"];
  window.addEventListener("mouseup", () => dragging = false);
  for (let i = 0; i < rows; i++) {
    let row = document.createElement("tr");
    row.innerHTML = `<td>${i}</td>`;
    for (let j = 0; j < props.length; j++) {
      let data = document.createElement("td");
      let input = document.createElement("input");
      input.type = "checkbox";
      const checkPos = () => {
        if (i + rowOffset < values.currentFrame) {
          tools.setFrame(i + rowOffset);
          scrollTable();
          updateTable();
        }
      };
      data.addEventListener("mousedown", (e) => {
        if (e.button !== 0) return;
        dragging = true;
        draggingChecked = !values.frames[i + rowOffset][props[j]];
        values.frames[i + rowOffset][props[j]] = draggingChecked;
        input.checked = draggingChecked;
        checkPos();
      });
      data.addEventListener("mouseenter", () => {
        if (!dragging) return;
        values.frames[i + rowOffset][props[j]] = draggingChecked;
        input.checked = draggingChecked;
        checkPos();
      });
      input.addEventListener("click", (e) => e.preventDefault());
      data.appendChild(input);
      row.appendChild(data);
    }
    updateTable();
    div.querySelector("table")?.appendChild(row);
  }
  function updateTable() {
    let table = div.querySelector("table");
    let rowEls = table?.querySelectorAll("tr:not(:first-child)");
    if (!rowEls) return;
    let frames2 = values.frames;
    rowOffset = Math.max(0, rowOffset);
    for (let i = frames2.length; i < rowOffset + rowEls.length; i++) {
      if (frames2[i]) continue;
      frames2[i] = { right: false, left: false, up: false };
    }
    for (let i = 0; i < rowEls.length; i++) {
      let row = rowEls[i];
      row.classList.toggle("active", i + rowOffset === values.currentFrame);
      let frame = frames2[i + rowOffset];
      if (!frame) continue;
      row.firstChild.textContent = (i + rowOffset).toString();
      let checkboxes = rowEls[i].querySelectorAll("input");
      checkboxes[0].checked = frame.left;
      checkboxes[1].checked = frame.right;
      checkboxes[2].checked = frame.up;
    }
  }
  function scrollTable() {
    if (values.currentFrame - rowOffset < 3) {
      rowOffset = values.currentFrame - 3;
    } else if (values.currentFrame - rowOffset > rows - 3) {
      rowOffset = values.currentFrame - (rows - 3);
    }
  }
  function onStep(event) {
    if (playing || controlling) return;
    if (event.shiftKey) {
      for (let i = 0; i < 5; i++) {
        tools.advanceFrame();
      }
    } else {
      tools.advanceFrame();
    }
    scrollTable();
    updateTable();
  }
  function onBack(event) {
    if (playing || controlling) return;
    if (event.shiftKey) {
      tools.setFrame(Math.max(0, values.currentFrame - 5));
    } else {
      tools.setFrame(Math.max(0, values.currentFrame - 1));
    }
    scrollTable();
    updateTable();
  }
  window.addEventListener("wheel", (e) => {
    rowOffset += Math.sign(e.deltaY);
    rowOffset = Math.max(0, rowOffset);
    updateTable();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key === "ArrowRight") {
      onStep(e);
    } else if (e.key === "ArrowLeft") {
      onBack(e);
    }
  });
  setInterval(() => save(values.frames), 6e4);
  window.addEventListener("beforeunload", () => save(values.frames));
  document.body.appendChild(div);
  document.body.appendChild(countdownDiv);
}

// src/index.ts
gimloader_default.lib("DLDUtils").setLaserWarningEnabled(false);
gimloader_default.UI.addStyles(styles_default);
var startTasBtn = document.createElement("button");
startTasBtn.id = "startTasBtn";
startTasBtn.innerText = "Start TAS";
startTasBtn.addEventListener("click", () => startTasBtn.remove());
gimloader_default.onStop(() => startTasBtn.remove());
gimloader_default.net.onLoad(() => {
  document.body.appendChild(startTasBtn);
});
gimloader_default.parcel.getLazy((exports) => exports?.PhysicsManager, (exports) => {
  let physManClass = exports.PhysicsManager;
  delete exports.PhysicsManager;
  exports.PhysicsManager = class extends physManClass {
    constructor() {
      super(...arguments);
      startTasBtn.addEventListener("click", () => {
        createUI(this);
      });
    }
  };
});
var moveSpeed = 310;
function getMoveSpeed() {
  return moveSpeed;
}
function setMoveSpeed(speed) {
  moveSpeed = speed;
}
export {
  getMoveSpeed,
  setMoveSpeed
};
