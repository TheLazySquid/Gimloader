/**
 * @name DLDTAS
 * @description Allows you to create TASes for Dont Look Down
 * @author TheLazySquid
 */
let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.id = "tasOverlay";
let ctx = canvas.getContext("2d");
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});
function initOverlay() {
    document.body.appendChild(canvas);
    setInterval(render, 1000 / 15);
}
function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let physics = GL.stores.phaser.mainCharacter.physics;
    let collider = physics.getBody().collider;
    let { halfHeight, radius } = collider._shape;
    let { x: cX, y: cY } = GL.stores.phaser.scene.cameras.cameras[0].midPoint;
    let { x, y } = physics.getBody().rigidBody.translation();
    let { x: vX, y: vY } = physics.getBody().rigidBody.linvel();
    // display the current coordinates and velocity of the player
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
    // convert the position to screen space
    x = (x * 100) - cX + window.innerWidth / 2;
    y = (y * 100) - cY + window.innerHeight / 2;
    radius *= 100;
    halfHeight *= 100;
    ctx.strokeStyle = "#2fd45b";
    ctx.lineWidth = 3;
    // render the capsule shaped collider
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

function generatePhysicsInput(frame, lastFrame) {
    let jump = frame.up && !lastFrame?.up;
    /* The angle is determined like so: 0 for right, 180 for left etc.
    If two opposing keys are pressed, it is null. Otherwise it will be in between, so 45 for down + right
    If three or more keys are pressed up and left take precedence over their opposite one.*/
    let angle = null;
    // none pressed
    if (!frame.right && !frame.left && !frame.up)
        angle = null;
    // one pressed
    else if (frame.right && !frame.left && !frame.up)
        angle = 0;
    else if (!frame.right && frame.left && !frame.up)
        angle = 180;
    else if (!frame.right && !frame.left && frame.up)
        angle = 270;
    // two pressed
    else if (frame.right && !frame.left && frame.up)
        angle = 315;
    else if (frame.right && frame.left && !frame.up)
        angle = null;
    else if (!frame.right && frame.left && frame.up)
        angle = 225;
    // all pressed
    else if (!frame.right && !frame.left && !frame.up)
        angle = 225;
    return { angle, jump, _jumpKeyPressed: frame.up };
}

let frames = JSON.parse(localStorage.getItem("frames") || "[]");
let currentFrame = 0;
let rowOffset = 0;
function init(physicsManager) {
    let nativeStep = physicsManager.physicsStep;
    physicsManager.physicsStep = (dt) => {
        // only rerender, rather than running the physics loop
        GL.stores.phaser.mainCharacter.physics.postUpdate(dt);
    };
    initOverlay();
    let physics = GL.stores.phaser.mainCharacter.physics;
    let rb = physics.getBody().rigidBody;
    let inputManager = GL.stores.phaser.scene.inputManager;
    rb.setTranslation({
        "x": 33.87,
        "y": 638.38
    }, true);
    let div = document.createElement("div");
    div.id = "inputTable";
    div.innerHTML = `
    <div class="btns">
        <button id="backFrame">&larr;</button>
        <button id="play">&#9654;</button>
        <button id="advanceFrame">&rarr;</button>
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
    // add listeners to the buttons
    div.querySelector("#advanceFrame")?.addEventListener("click", (e) => onStep(e));
    div.querySelector("#backFrame")?.addEventListener("click", (e) => onBack(e));
    let playing = false;
    let playBtn = div.querySelector("#play");
    playBtn?.addEventListener("click", () => {
        playing = !playing;
        playBtn.innerHTML = playing ? "&#9209;" : "&#9654;";
        if (playing) {
            physicsManager.physicsStep = (dt) => {
                // set the inputs
                let frame = frames[currentFrame];
                if (frame) {
                    let translation = rb.translation();
                    frames[currentFrame].translation = { x: translation.x, y: translation.y };
                    frames[currentFrame].state = JSON.stringify(physics.state);
                    let input = generatePhysicsInput(frame, frames[currentFrame - 1]);
                    inputManager.getPhysicsInput = () => input;
                }
                // step the game
                nativeStep(dt);
                // advance the frame
                currentFrame++;
                scrollTable();
                updateTable();
            };
        }
        else {
            physicsManager.physicsStep = (dt) => {
                // only rerender, rather than running the physics loop
                GL.stores.phaser.mainCharacter.physics.postUpdate(dt);
            };
        }
    });
    // download the frames as a json file
    div.querySelector("#download")?.addEventListener("click", () => {
        let data = JSON.stringify(save(), null, 4);
        let blob = new Blob([data], { type: "text/plain" });
        let url = URL.createObjectURL(blob);
        let a = document.createElement("a");
        a.href = url;
        a.download = "tas.json";
        a.click();
        URL.revokeObjectURL(url);
    });
    // upload a json file
    div.querySelector("#upload")?.addEventListener("click", () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";
        input.click();
        input.addEventListener("change", () => {
            let file = input.files?.[0];
            if (!file)
                return;
            let reader = new FileReader();
            reader.onload = () => {
                let data = reader.result;
                if (typeof data !== "string")
                    return;
                frames = JSON.parse(data);
                currentFrame = 0;
                rowOffset = 0;
                updateTable();
            };
            reader.readAsText(file);
        });
    });
    let rows = Math.floor(window.innerHeight / 26) - 1;
    let dragging = false;
    let draggingChecked = false;
    let props = ["left", "right", "up"];
    window.addEventListener("mouseup", () => dragging = false);
    for (let i = 0; i < rows; i++) {
        let row = document.createElement("tr");
        row.innerHTML = `<td></td>`;
        // add the checkboxes to the frames array
        for (let j = 0; j < props.length; j++) {
            let data = document.createElement("td");
            let input = document.createElement("input");
            input.type = "checkbox";
            const checkPos = () => {
                if (i + rowOffset <= currentFrame) {
                    currentFrame = i + rowOffset - 1;
                    setFrame(i + rowOffset);
                }
            };
            // add listeners
            data.addEventListener("mousedown", () => {
                dragging = true;
                draggingChecked = !frames[i + rowOffset][props[j]];
                frames[i + rowOffset][props[j]] = draggingChecked;
                input.checked = draggingChecked;
                checkPos();
            });
            data.addEventListener("mouseenter", () => {
                if (!dragging)
                    return;
                frames[i + rowOffset][props[j]] = draggingChecked;
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
    function save() {
        let saveList = [];
        for (let frame of frames) {
            let { translation, state, ...save } = frame;
            saveList.push(save);
        }
        localStorage.setItem("frames", JSON.stringify(saveList));
        return saveList;
    }
    // periodically save the current translation and state
    setInterval(save, 60000);
    window.addEventListener("beforeunload", save);
    function onStep(event) {
        if (playing)
            return;
        if (event.shiftKey) {
            for (let i = 0; i < 5; i++) {
                advanceFrame();
            }
        }
        else {
            advanceFrame();
        }
        scrollTable();
        updateTable();
    }
    function onBack(event) {
        if (playing)
            return;
        if (event.shiftKey) {
            setFrame(Math.max(0, currentFrame - 5));
        }
        else {
            setFrame(Math.max(0, currentFrame - 1));
        }
        scrollTable();
        updateTable();
    }
    function advanceFrame() {
        let frame = frames[currentFrame];
        if (!frame)
            return;
        // log the current translation and state
        let translation = rb.translation();
        frame.translation = { x: translation.x, y: translation.y };
        frame.state = JSON.stringify(physics.state);
        // generate the input
        let lastFrame = frames[currentFrame - 1];
        let input = generatePhysicsInput(frame, lastFrame);
        inputManager.getPhysicsInput = () => input;
        // step the game
        nativeStep(0);
        currentFrame++;
    }
    // this function should only ever be used when going back in time
    function setFrame(number) {
        let frame = frames[number];
        if (!frame || !frame.translation || !frame.state)
            return;
        rb.setTranslation(frame.translation, true);
        physics.state = JSON.parse(frame.state);
        currentFrame = number;
    }
    function updateTable() {
        let table = div.querySelector("table");
        let rowEls = table?.querySelectorAll("tr:not(:first-child)");
        if (!rowEls)
            return;
        rowOffset = Math.max(0, rowOffset);
        // add frames to the array if they don't exist
        for (let i = frames.length; i < rowOffset + rowEls.length; i++) {
            if (frames[i])
                continue;
            frames[i] = { right: false, left: false, up: false };
        }
        for (let i = 0; i < rowEls.length; i++) {
            let row = rowEls[i];
            row.classList.toggle("active", i + rowOffset === currentFrame);
            // update the row
            let frame = frames[i + rowOffset];
            if (!frame)
                continue;
            row.firstChild.textContent = (i + rowOffset).toString();
            let checkboxes = rowEls[i].querySelectorAll("input");
            checkboxes[0].checked = frame.left;
            checkboxes[1].checked = frame.right;
            checkboxes[2].checked = frame.up;
        }
    }
    function scrollTable() {
        // if the currentFrame is within 3 of the top or bottom, move the table
        if (currentFrame - rowOffset < 3)
            rowOffset = currentFrame - 3;
        else if (currentFrame - rowOffset > rows - 3)
            rowOffset = currentFrame - (rows - 3);
    }
    // move the table when scrolling
    window.addEventListener("wheel", (e) => {
        rowOffset += Math.sign(e.deltaY);
        rowOffset = Math.max(0, rowOffset);
        updateTable();
    });
    window.addEventListener("keydown", (e) => {
        if (e.key === "ArrowRight") {
            onStep(e);
        }
        else if (e.key === "ArrowLeft") {
            onBack(e);
        }
    });
    document.body.appendChild(div);
}

var styles = "#startTasBtn {\n  position: fixed;\n  top: 0;\n  left: 0;\n  margin: 5px;\n  padding: 5px;\n  background-color: rgba(0, 0, 0, 0.5);\n  color: white;\n  cursor: pointer;\n  z-index: 99999999999;\n  border-radius: 5px;\n  user-select: none;\n}\n\n#tasOverlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  z-index: 99999999999;\n  pointer-events: none;\n}\n\n#inputTable {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  z-index: 99999999999;\n  background-color: rgba(255, 255, 255, 0.5);\n}\n#inputTable .btns {\n  display: flex;\n  gap: 5px;\n  align-items: center;\n  justify-content: center;\n}\n#inputTable table {\n  height: 100%;\n  table-layout: fixed;\n  user-select: none;\n}\n#inputTable tr {\n  height: 20px;\n}\n#inputTable tr.active {\n  background-color: rgba(0, 138, 197, 0.892) !important;\n}\n#inputTable tr:nth-child(even) {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n#inputTable td, #inputTable th {\n  width: 75px;\n  text-align: center;\n}";

/// <reference types="gimloader" />
GL.UI.addStyles("TAS", styles);
let startTasBtn = document.createElement("button");
startTasBtn.id = "startTasBtn";
startTasBtn.innerText = "Start TAS";
startTasBtn.addEventListener("click", () => startTasBtn.remove());
GL.addEventListener("loadEnd", () => {
    document.body.appendChild(startTasBtn);
});
GL.parcel.interceptRequire("TAS", exports => exports?.PhysicsManager, exports => {
    let physManClass = exports.PhysicsManager;
    delete exports.PhysicsManager;
    exports.PhysicsManager = class extends physManClass {
        constructor() {
            super(...arguments);
            startTasBtn.addEventListener("click", () => {
                init(this);
            });
        }
    };
});
// disable the physics state from the server
GL.parcel.interceptRequire("TAS", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {
    let ignoreServer = false;
    startTasBtn.addEventListener("click", () => {
        ignoreServer = true;
    });
    // prevent colyseus from complaining that nothing is registered
    GL.patcher.instead("TAS", exports, "default", (_, args) => {
        args[0].onMessage("PHYSICS_STATE", (packet) => {
            if (ignoreServer)
                return;
            moveCharToPos(packet.x / 100, packet.y / 100);
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
    GL.UI.removeStyles("TAS");
    GL.parcel.stopIntercepts("TAS");
    GL.patcher.unpatchAll("TAS");
}

export { onStop };
