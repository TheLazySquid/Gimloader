import { Key } from "react";
import { IFrameInfo } from "../types"
import { initOverlay } from "./overlay"
import { generatePhysicsInput } from "./util";

let frames: IFrameInfo[] = JSON.parse(localStorage.getItem("frames") || "[]")
let currentFrame = 0;
let rowOffset = 0;

export function init(physicsManager: any) {
    let nativeStep = physicsManager.physicsStep;
    physicsManager.physicsStep = (dt: number) => {
        // only rerender, rather than running the physics loop
        GL.stores.phaser.mainCharacter.physics.postUpdate(dt);
    }

    initOverlay();

    let physics = GL.stores.phaser.mainCharacter.physics;
    let rb = physics.getBody().rigidBody;
    let inputManager = GL.stores.phaser.scene.inputManager;

    rb.setTranslation({
        "x": 33.87,
        "y": 638.38
    }, true);

    let div = document.createElement("div")
    div.id = "inputTable"

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
    div.querySelector("#advanceFrame")?.addEventListener("click", (e) => onStep(e as MouseEvent))
    div.querySelector("#backFrame")?.addEventListener("click", (e) => onBack(e as MouseEvent))
    
    let playing = false;
    let playBtn = div.querySelector("#play")
    playBtn?.addEventListener("click", () => {
        playing = !playing;
        playBtn.innerHTML = playing ? "&#9209;" : "&#9654;";

        if(playing) {
            physicsManager.physicsStep = (dt: number) => {
                // set the inputs
                let frame = frames[currentFrame]
                if(frame) {
                    let translation = rb.translation()
                    frames[currentFrame].translation = { x: translation.x, y: translation.y }
                    frames[currentFrame].state = JSON.stringify(physics.state);

                    let input = generatePhysicsInput(frame, frames[currentFrame - 1])
                    inputManager.getPhysicsInput = () => input
                }

                // step the game
                nativeStep(dt);

                // advance the frame
                currentFrame++;
                scrollTable();
                updateTable();
            }
        } else {
            physicsManager.physicsStep = (dt: number) => {
                // only rerender, rather than running the physics loop
                GL.stores.phaser.mainCharacter.physics.postUpdate(dt);
            }
        }
    })

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
    })

    // upload a json file
    div.querySelector("#upload")?.addEventListener("click", () => {
        let input = document.createElement("input")
        input.type = "file"
        input.accept = ".json"
        input.click()

        input.addEventListener("change", () => {
            let file = input.files?.[0];
            if(!file) return;

            let reader = new FileReader();
            reader.onload = () => {
                let data = reader.result;
                if(typeof data !== "string") return;

                frames = JSON.parse(data)
                currentFrame = 0;
                rowOffset = 0;
                updateTable();
            }

            reader.readAsText(file);
        })
    })

    let rows = Math.floor(window.innerHeight / 26) - 1;

    let dragging = false;
    let draggingChecked = false;
    let props = ["left", "right", "up"]

    window.addEventListener("mouseup", () => dragging = false)

    for (let i = 0; i < rows; i++) {
        let row = document.createElement("tr")
        row.innerHTML = `<td></td>`;

        // add the checkboxes to the frames array
        for(let j = 0; j < props.length; j++) {
            let data = document.createElement("td")
            let input = document.createElement("input")
            input.type = "checkbox"

            const checkPos = () => {
                if(i + rowOffset <= currentFrame) {
                    currentFrame = i + rowOffset - 1
                    setFrame(i + rowOffset)
                }
            }

            // add listeners
            data.addEventListener("mousedown", () => {
                dragging = true;
                draggingChecked = !frames[i + rowOffset][props[j]]
                frames[i + rowOffset][props[j]] = draggingChecked
                input.checked = draggingChecked
                checkPos()
            })

            data.addEventListener("mouseenter", () => {
                if(!dragging) return;
                frames[i + rowOffset][props[j]] = draggingChecked
                input.checked = draggingChecked
                checkPos()
            })

            input.addEventListener("click", (e) => e.preventDefault())

            data.appendChild(input)
            row.appendChild(data)
        }

        updateTable();

        div.querySelector("table")?.appendChild(row)
    }

    function save() {
        let saveList: IFrameInfo[] = [];
        for(let frame of frames) {
            let { translation, state, ...save } = frame
            saveList.push(save)
        }
        localStorage.setItem("frames", JSON.stringify(saveList))

        return saveList
    }

    // periodically save the current translation and state
    setInterval(save, 60000)

    window.addEventListener("beforeunload", save)

    function onStep(event: MouseEvent | KeyboardEvent) {
        if(playing) return;
        if(event.shiftKey) {
            for(let i = 0; i < 5; i++) {
                advanceFrame()
            }
        } else {
            advanceFrame()
        }

        scrollTable();
        updateTable();
    }

    function onBack(event: MouseEvent | KeyboardEvent) {
        if(playing) return;
        if(event.shiftKey) {
            setFrame(Math.max(0, currentFrame - 5))
        } else {
            setFrame(Math.max(0, currentFrame - 1))
        }

        scrollTable();
        updateTable();
    }

    function advanceFrame() {
        let frame = frames[currentFrame]
        if(!frame) return

        // log the current translation and state
        let translation = rb.translation()
        frame.translation = { x: translation.x, y: translation.y }
        frame.state = JSON.stringify(physics.state);

        // generate the input
        let lastFrame = frames[currentFrame - 1]
        let input = generatePhysicsInput(frame, lastFrame)

        inputManager.getPhysicsInput = () => input

        // step the game
        nativeStep(0);
        
        currentFrame++;
    }

    // this function should only ever be used when going back in time
    function setFrame(number: number) {
        let frame = frames[number]
        if(!frame || !frame.translation || !frame.state) return

        rb.setTranslation(frame.translation, true)
        physics.state = JSON.parse(frame.state)

        currentFrame = number
    }

    function updateTable() {
        let table = div.querySelector("table")
        let rowEls = table?.querySelectorAll("tr:not(:first-child)")
        if (!rowEls) return

        rowOffset = Math.max(0, rowOffset)

        // add frames to the array if they don't exist
        for(let i = frames.length; i < rowOffset + rowEls.length; i++) {
            if(frames[i]) continue;
            frames[i] = { right: false, left: false, up: false }
        }

        for(let i = 0; i < rowEls.length; i++) {
            let row = rowEls[i]
            row.classList.toggle("active", i + rowOffset === currentFrame)

            // update the row
            let frame = frames[i + rowOffset]
            if(!frame) continue

            row.firstChild!.textContent = (i + rowOffset).toString()
            
            let checkboxes = rowEls[i].querySelectorAll("input")
            checkboxes[0].checked = frame.left
            checkboxes[1].checked = frame.right
            checkboxes[2].checked = frame.up
        }
    }

    function scrollTable() {
        // if the currentFrame is within 3 of the top or bottom, move the table
        if(currentFrame - rowOffset < 3) rowOffset = currentFrame - 3
        else if(currentFrame - rowOffset > rows - 3) rowOffset = currentFrame - (rows - 3)
    }

    // move the table when scrolling
    window.addEventListener("wheel", (e) => {
        rowOffset += Math.sign(e.deltaY)
        rowOffset = Math.max(0, rowOffset)
        updateTable()
    })

    window.addEventListener("keydown", (e) => {
        if(e.key === "ArrowRight") {
            onStep(e)
        } else if(e.key === "ArrowLeft") {
            onBack(e)
        }
    })

    document.body.appendChild(div)
}