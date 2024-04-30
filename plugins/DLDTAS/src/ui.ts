import { IFrameInfo, ISharedValues } from "../types";
import { initOverlay, showHitbox, hideHitbox } from "./overlay";
import TASTools from "./tools";
import { save } from "./util";
// @ts-ignore
import controller from '../assets/controller.svg';

let frames: IFrameInfo[] = JSON.parse(localStorage.getItem("frames") || "[]")
let values: ISharedValues = { frames, currentFrame: 0 }

export function createUI(physicsManager: any) {
    let rowOffset = 0;

    initOverlay();

    let tools = new TASTools(physicsManager, values, () => {
        scrollTable();
        updateTable();
    })

    let div = document.createElement("div")
    div.id = "inputTable"

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
        <button id="control">${controller}</button>
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

    // prevent accidentally clicking the buttons with space/enter
    div.querySelectorAll("button").forEach(btn => {
        btn.addEventListener("keydown", (e) => e.preventDefault())
    })

    // add listeners to the buttons
    div.querySelector("#advanceFrame")?.addEventListener("click", (e) => onStep(e as MouseEvent))
    div.querySelector("#backFrame")?.addEventListener("click", (e) => onBack(e as MouseEvent))
    
    let playing = false;
    let controlling = false;
    let playBtn = div.querySelector("#play")!;
    playBtn?.addEventListener("click", () => {
        if(controlling) return;
        setPlaying(!playing)
    })

    function setPlaying(value: boolean) {
        playing = value;
        playBtn.innerHTML = playing ? "&#9209;" : "&#9654;";

        if(playing) {
            tools.startPlaying();
            hideHitbox();
        } else {
            tools.stopPlaying();
            showHitbox();
        }
    }

    // download the frames as a json file
    div.querySelector("#download")?.addEventListener("click", () => {
        let data = JSON.stringify(save(values.frames), null, 4);
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
        setControlling(false);
        setPlaying(false);
        tools.stopPlaying();

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

                values.frames = JSON.parse(data)
                tools.reset();
                values.currentFrame = 0;
                rowOffset = 0;
                updateTable();
            }

            reader.readAsText(file);
        })
    })

    div.querySelector("#reset")?.addEventListener("click", () => {
        let conf = confirm("Are you sure you want to reset?");
        if(!conf) return;

        setPlaying(false);
        setControlling(false);

        values.frames = []
        values.currentFrame = 0;
        rowOffset = 0;
        tools.reset();
        tools.stopPlaying();
        updateTable();
    })

    let controlBtn = div.querySelector("#control")!;
    controlBtn.addEventListener("click", () => {
        if(playing) return;
        setControlling(!controlling)
    })

    let countdownDiv = document.createElement("div");
    countdownDiv.id = "controlCountdown";
    let countdownContent = document.createElement("div");
    countdownDiv.appendChild(countdownContent);
    let activateTimeout: number;

    function setControlling(value: boolean) {
        controlling = value;
        controlBtn.innerHTML = controlling ? "&#9209;" : controller;

        if(controlling) {
            countdownContent.style.display = "block";
            countdownContent.innerHTML = "3";

            // start the countdown
            setTimeout(() => countdownContent.innerHTML = "2", 1000)
            setTimeout(() => countdownContent.innerHTML = "1", 2000)
            activateTimeout = setTimeout(() => {
                countdownContent.innerHTML = "";
                countdownContent.style.display = "none";
                tools.startControlling();
            }, 3000)
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
    let speedupBtn = div.querySelector("#speedup")!;
    let speeddownBtn = div.querySelector("#speeddown")!;
    let speed = div.querySelector("#speed")! as HTMLSpanElement;

    function updateSlowdown() {
        if(slowdownIndex === 0) speed.innerText = "1x"
        else speed.innerText = `1/${slowdowns[slowdownIndex]}x`

        // disable the buttons if necessary
        if(slowdownIndex === 0) speedupBtn.setAttribute("disabled", "true")
        else speedupBtn.removeAttribute("disabled")

        if(slowdownIndex === slowdowns.length - 1) speeddownBtn.setAttribute("disabled", "true")
        else speeddownBtn.removeAttribute("disabled")
    }

    speeddownBtn.addEventListener("click", () => {
        slowdownIndex++;
        tools.setSlowdown(slowdowns[slowdownIndex])
        updateSlowdown();
    })

    speedupBtn.addEventListener("click", () => {
        slowdownIndex--;
        tools.setSlowdown(slowdowns[slowdownIndex])
        updateSlowdown();
    })

    let rows = Math.floor((window.innerHeight - 60) / 26) - 1;

    let dragging = false;
    let draggingChecked = false;
    let props = ["left", "right", "up"]

    window.addEventListener("mouseup", () => dragging = false)

    for (let i = 0; i < rows; i++) {
        let row = document.createElement("tr")
        row.innerHTML = `<td>${i}</td>`;

        // add the checkboxes to the frames array
        for(let j = 0; j < props.length; j++) {
            let data = document.createElement("td")
            let input = document.createElement("input")
            input.type = "checkbox"

            const checkPos = () => {
                if(i + rowOffset <= values.currentFrame) {
                    values.currentFrame = i + rowOffset;
                    tools.setFrame(i + rowOffset)
                    scrollTable();
                    updateTable();
                }
            }

            // add listeners
            data.addEventListener("mousedown", () => {
                dragging = true;
                draggingChecked = !values.frames[i + rowOffset][props[j]]
                values.frames[i + rowOffset][props[j]] = draggingChecked
                input.checked = draggingChecked
                checkPos()
            })

            data.addEventListener("mouseenter", () => {
                if(!dragging) return;
                values.frames[i + rowOffset][props[j]] = draggingChecked
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

    function updateTable() {
        let table = div.querySelector("table")
        let rowEls = table?.querySelectorAll("tr:not(:first-child)")
        if (!rowEls) return
        let frames = values.frames

        rowOffset = Math.max(0, rowOffset)

        // add frames to the array if they don't exist
        for(let i = frames.length; i < rowOffset + rowEls.length; i++) {
            if(frames[i]) continue;
            frames[i] = { right: false, left: false, up: false }
        }

        for(let i = 0; i < rowEls.length; i++) {
            let row = rowEls[i]
            row.classList.toggle("active", i + rowOffset === values.currentFrame)

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
        if(values.currentFrame - rowOffset < 3) {
            rowOffset = values.currentFrame - 3
        } else if(values.currentFrame - rowOffset > rows - 3) {
            rowOffset = values.currentFrame - (rows - 3)
        }
    }

    function onStep(event: MouseEvent | KeyboardEvent) {
        if(playing || controlling) return;
        if(event.shiftKey) {
            for(let i = 0; i < 5; i++) {
                tools.advanceFrame();
            }
        } else {
            tools.advanceFrame();
        }

        scrollTable();
        updateTable();
    }

    function onBack(event: MouseEvent | KeyboardEvent) {
        if(playing || controlling) return;
        if(event.shiftKey) {
            tools.setFrame(Math.max(0, values.currentFrame - 5))
        } else {
            tools.setFrame(Math.max(0, values.currentFrame - 1))
        }

        scrollTable();
        updateTable();
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

    // periodically save the current translation and state
    setInterval(() => save(values.frames), 60000)
    window.addEventListener("beforeunload", () => save(values.frames))

    document.body.appendChild(div)
    document.body.appendChild(countdownDiv)
}