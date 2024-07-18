/**
 * @name DLDTimer
 * @description Times DLD runs, and shows you your time for each summit
 * @author TheLazySquid
 * @version 0.2.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/DLDTimer/build/DLDTimer.js
 */
function onceOrIfLoaded(callback) {
    if (GL.net.type === "Colyseus")
        callback();
    GL.addEventListener("loadEnd", () => {
        if (GL.net.type === "Colyseus")
            callback();
    }, { once: true });
}
function fmtMs(ms) {
    ms = Math.round(ms);
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);
    ms %= 1000;
    seconds %= 60;
    if (minutes > 0)
        return `${minutes}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    return `${seconds}.${String(ms).padStart(3, '0')}`;
}
function inArea(coords, area) {
    if (area.direction === "right" && coords.x < area.x)
        return false;
    if (area.direction === "left" && coords.x > area.x)
        return false;
    if (coords.y > area.y + 10)
        return false; // little bit of leeway
    return true;
}

var styles = "#timer {\n  position: absolute;\n  top: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.85);\n  color: white;\n  z-index: 999999999;\n}\n#timer .restart {\n  background-color: transparent;\n  border: none;\n  width: 20px;\n  height: 20px;\n  margin: 0;\n  padding: 0;\n}\n#timer .restart svg {\n  width: 20px;\n  height: 20px;\n}\n#timer .bar {\n  display: flex;\n  align-items: center;\n  padding: 5px 10px;\n  gap: 10px;\n}\n#timer select {\n  background: transparent;\n}\n#timer option {\n  background-color: black;\n}\n#timer .runType {\n  padding-left: 10px;\n}\n#timer tr:nth-child(even) {\n  background-color: rgba(255, 255, 255, 0.12);\n}\n#timer tr.active {\n  background-color: rgba(28, 145, 235, 0.864);\n}\n#timer td:first-child {\n  padding-left: 10px;\n}\n#timer .attempts {\n  flex-grow: 1;\n  text-align: right;\n}\n#timer .total {\n  font-size: xx-large;\n  width: 100%;\n  text-align: right;\n  padding-right: 10px;\n}\n#timer .ahead {\n  color: green;\n}\n#timer .behind {\n  color: red;\n}\n#timer .best {\n  color: gold;\n}\n\n#DLDTimer-settings .category {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}";

const summitStartCoords = [
    { x: 9071, y: 65000, direction: "right" }, // summit 1
    { x: 28788.9, y: 53278, direction: "left" }, // summit 2
    { x: 21387.95, y: 50078, direction: "right" }, // summit 3
    { x: 39693.5, y: 41374, direction: "right" }, // summit 4
    { x: 35212, y: 35166, direction: "right" }, // summit 5
    { x: 39755.93, y: 28573, direction: "right" }, // summit 6
    { x: 40395.91, y: 13854, direction: "right" } // finish
];
const summitCoords = [{
        x: 9022.997283935547,
        y: 63837.7685546875,
        direction: "right"
    }, {
        x: 28544.000244140625,
        y: 53278.0029296875,
        direction: "left"
    }, {
        x: 21755.00030517578,
        y: 50077.99987792969,
        direction: "right"
    }, {
        x: 40033.99963378906,
        y: 41373.9990234375,
        direction: "right"
    }, {
        x: 35654.00085449219,
        y: 35166.00036621094,
        direction: "right"
    }, {
        x: 40126.99890136719,
        y: 28573.9990234375,
        direction: "right"
    }];
const resetCoordinates = { x: 9050, y: 6300 };
const splitNames = ["Summit 1", "Summit 2", "Summit 3", "Summit 4", "Summit 5", "Summit 6"];
const categories = ["Current Patch", "Creative Platforming Patch", "Original Physics"];

function Settings({ ui }) {
    const React = GL.React;
    const [category, setCategory] = React.useState(ui.category);
    const [attempts, setAttempts] = React.useState(ui.attempts);
    const [personalBest, setPersonalBest] = React.useState(ui.personalBest);
    const [bestSplits, setBestSplits] = React.useState(ui.bestSplits);
    React.useEffect(() => {
        setAttempts(GL.storage.getValue("DLD Timer", `attempts-${category}`, 0));
        setPersonalBest(GL.storage.getValue("DLD Timer", `pb-${category}`, []));
        setBestSplits(GL.storage.getValue("DLD Timer", `bestSplits-${category}`, []));
    }, [category]);
    return (React.createElement("div", { id: "DLDTimer-settings" },
        React.createElement("h1", null, "Manage data"),
        React.createElement("div", { className: "category" },
            "Category:",
            React.createElement("select", { value: category, onChange: (e) => setCategory(e.target.value) },
                React.createElement("option", { value: "Current Patch" }, "Current Patch"),
                React.createElement("option", { value: "Creative Platforming Patch" }, "Creative Platforming Patch"),
                React.createElement("option", { value: "Original Physics" }, "Original Physics"))),
        React.createElement("hr", null),
        React.createElement("div", null,
            "Attempts: ",
            attempts),
        attempts > 0 && React.createElement("button", { onClick: () => {
                setAttempts(0);
                GL.storage.removeValue("DLD Timer", `attempts-${category}`);
                ui.attempts = 0;
            } }, "Reset"),
        React.createElement("hr", null),
        personalBest.length === 0 ? React.createElement("div", null, "No personal bests recorded") : React.createElement("div", null,
            React.createElement("div", null,
                "Current personal best: ",
                fmtMs(personalBest[personalBest.length - 1])),
            React.createElement("button", { onClick: () => {
                    setPersonalBest([]);
                    GL.storage.removeValue("DLD Timer", `pb-${category}`);
                    ui.personalBest = [];
                } }, "Reset")),
        React.createElement("hr", null),
        bestSplits.length === 0 ? React.createElement("div", null, "No best summit times") : React.createElement("div", null,
            "Best summit times: ",
            bestSplits.map((time, i) => React.createElement("div", { key: i },
                splitNames[i],
                ": ",
                fmtMs(time))),
            React.createElement("button", { onClick: () => {
                    setBestSplits([]);
                    GL.storage.removeValue("DLD Timer", `bestSplits-${category}`);
                    ui.bestSplits = [];
                } }, "Reset"))));
}

var restore = "<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 24 24\"><path d=\"M13,3A9,9 0 0,0 4,12H1L4.89,15.89L4.96,16.03L9,12H6A7,7 0 0,1 13,5A7,7 0 0,1 20,12A7,7 0 0,1 13,19C11.07,19 9.32,18.21 8.06,16.94L6.64,18.36C8.27,20 10.5,21 13,21A9,9 0 0,0 22,12A9,9 0 0,0 13,3Z\" fill=\"white\" /></svg>";

class UI {
    timer;
    autosplitter;
    element;
    total;
    splitRows = [];
    splitDatas = [];
    attemptsEl;
    constructor(timer) {
        this.timer = timer;
        this.autosplitter = timer.autosplitter;
    }
    create() {
        this.element = document.createElement("div");
        this.element.id = "timer";
        this.total = document.createElement("div");
        this.total.classList.add("total");
        this.total.innerText = "0.00";
        let topBar = document.createElement("div");
        topBar.classList.add("bar");
        // make the category selector
        let categorySelect = document.createElement("select");
        topBar.appendChild(categorySelect);
        for (let category of categories) {
            let option = document.createElement("option");
            option.value = category;
            option.innerText = category;
            if (category === this.timer.category)
                option.selected = true;
            categorySelect.appendChild(option);
        }
        // make the attempts counter
        this.attemptsEl = document.createElement("div");
        this.attemptsEl.classList.add("attempts");
        this.attemptsEl.innerText = String(this.timer.attempts);
        topBar.appendChild(this.attemptsEl);
        // make the run type selector
        let runTypeBar = document.createElement("div");
        runTypeBar.classList.add("bar");
        let runTypeSelect = document.createElement("select");
        runTypeSelect.innerHTML = `<option value="Full Game">Full Game</option>`;
        for (let i = 0; i < splitNames.length; i++) {
            let option = document.createElement("option");
            option.value = String(i);
            option.innerText = splitNames[i];
            if (this.autosplitter.mode === "Summit" && this.autosplitter.ilsummit === i)
                option.selected = true;
            runTypeSelect.appendChild(option);
        }
        runTypeBar.appendChild(runTypeSelect);
        let preboostSelect = document.createElement("select");
        preboostSelect.innerHTML = `
        <option value="false">No Preboosts</option>
        <option value="true">Preboosts</option>`;
        preboostSelect.value = String(this.autosplitter.ilPreboosts);
        if (this.timer.category === "Current Patch")
            preboostSelect.disabled = true;
        this.element.appendChild(topBar);
        this.element.appendChild(runTypeBar);
        let table = document.createElement("table");
        this.element.appendChild(table);
        for (let name of splitNames) {
            let row = document.createElement("tr");
            row.innerHTML = `
            <td style="min-width: 120px;">${name}</td>
            <td style="min-width: 60px;"></td>
            <td class="comparison" style="min-width: 80px;"></td>
            <td style="min-width: 60px;"></td>`;
            this.splitRows.push(row);
            this.splitDatas.push(Array.from(row.children));
            table.appendChild(row);
        }
        this.element.appendChild(this.total);
        document.body.appendChild(this.element);
        // update the category when the select changes
        categorySelect.addEventListener("change", () => {
            this.timer.updateCategory(categorySelect.value);
            // there isn't a preboosts option for current patch
            if (categorySelect.value === "Current Patch") {
                preboostSelect.value = "false";
                preboostSelect.disabled = true;
            }
            else {
                preboostSelect.disabled = false;
            }
        });
        if (runTypeSelect.value !== "Full Game") {
            table.style.display = "none";
            runTypeBar.appendChild(preboostSelect);
        }
        runTypeSelect.addEventListener("change", () => {
            if (runTypeSelect.value === "Full Game") {
                table.style.display = "";
                preboostSelect.remove();
                this.autosplitter.setMode("Full Game");
            }
            else {
                table.style.display = "none";
                runTypeBar.appendChild(preboostSelect);
                this.autosplitter.setMode("Summit", parseInt(runTypeSelect.value), preboostSelect.value === "true");
            }
        });
        preboostSelect.addEventListener("change", () => {
            this.autosplitter.setMode("Summit", parseInt(runTypeSelect.value), preboostSelect.value === "true");
        });
        // prevent left/right from changing the category
        categorySelect.addEventListener("keydown", (e) => e.preventDefault());
        runTypeSelect.addEventListener("keydown", (e) => e.preventDefault());
        preboostSelect.addEventListener("keydown", (e) => e.preventDefault());
    }
    update(totalMs, splitMs) {
        this.total.innerText = fmtMs(totalMs);
        this.splitDatas[this.timer.currentSplit][1].innerText = fmtMs(splitMs);
        let pb = this.timer.personalBest[this.timer.currentSplit];
        if (pb) {
            let amountBehind = totalMs - pb;
            if (amountBehind > 0) {
                this.splitDatas[this.timer.currentSplit][2].innerText = `+${fmtMs(amountBehind)}`;
                this.splitDatas[this.timer.currentSplit][2].classList.add("behind");
            }
        }
    }
    setFinalSplit(split, totalMs, diff, ahead, best) {
        let els = this.splitDatas[split];
        els[3].innerText = fmtMs(totalMs);
        if (diff === undefined || ahead === undefined || best === undefined)
            return;
        let str;
        if (ahead)
            str = `-${fmtMs(-diff)}`;
        else
            str = `+${fmtMs(diff)}`;
        els[2].innerText = str;
        if (best)
            els[2].classList.add("best");
        else if (ahead)
            els[2].classList.add("ahead");
        else
            els[2].classList.add("behind");
    }
    lockInCategory() {
        let selects = this.element.querySelectorAll("select");
        for (let select of selects) {
            select.disabled = true;
            select.title = "Cannot be altered mid-run";
        }
        let resetButton = document.createElement("button");
        resetButton.classList.add("restart");
        resetButton.innerHTML = restore;
        resetButton.addEventListener("click", () => {
            this.autosplitter.reset();
        });
        this.element.firstChild?.firstChild?.before(resetButton);
    }
    setTotalAhead(ahead) {
        this.total.classList.toggle("ahead", ahead);
        this.total.classList.toggle("behind", !ahead);
    }
    lastActiveRow = null;
    setActiveSplit(split) {
        if (this.lastActiveRow)
            this.lastActiveRow.classList.remove("active");
        if (split === null)
            return;
        this.splitRows[split].classList.add("active");
        this.lastActiveRow = this.splitRows[split];
    }
    setAttempts(attempts) {
        this.attemptsEl.innerText = String(attempts);
    }
    remove() {
        this.element?.remove();
    }
}

class Timer {
    autosplitter;
    ui;
    attempts = 0;
    category = "Current Patch";
    startTime;
    splitStart;
    started = false;
    currentSplit = 0;
    now = 0;
    splitTimes = [];
    bestSplits = [];
    personalBest = [];
    constructor(autosplitter) {
        this.autosplitter = autosplitter;
        this.ui = new UI(this);
    }
    init() {
        this.category = "Current Patch";
        if (GL.pluginManager.isEnabled("BringBackBoosts")) {
            if (GL.storage.getValue("BringBackBoosts", "useOriginalPhysics", false)) {
                this.category = "Original Physics";
            }
            else {
                this.category = "Creative Platforming Patch";
            }
        }
        this.attempts = GL.storage.getValue("DLD Timer", `attempts-${this.category}`, 0);
        this.personalBest = GL.storage.getValue("DLD Timer", `pb-${this.category}`, []);
        this.bestSplits = GL.storage.getValue("DLD Timer", `bestSplits-${this.category}`, []);
        this.ui.create();
    }
    start(currentSplit = 0) {
        this.startTime = performance.now();
        this.splitStart = this.startTime;
        this.started = true;
        this.currentSplit = currentSplit;
        this.ui.setActiveSplit(0);
        this.ui.lockInCategory();
        // increment the attempts
        this.attempts++;
        this.ui.setAttempts(this.attempts);
        GL.storage.setValue("DLD Timer", `attempts-${this.category}`, this.attempts);
    }
    updateCategory(name) {
        this.category = name;
        this.attempts = GL.storage.getValue("DLD Timer", `attempts-${this.category}`, 0);
        this.ui.setAttempts(this.attempts);
        this.personalBest = GL.storage.getValue("DLD Timer", `pb-${this.category}`, []);
        this.bestSplits = GL.storage.getValue("DLD Timer", `bestSplits-${this.category}`, []);
    }
    split(finishIl = false) {
        // add the comparison and total time
        let totalMs = this.now - this.startTime;
        let splitMs = totalMs - (this.splitTimes[this.splitTimes.length - 1] ?? 0);
        let best = this.bestSplits[this.currentSplit];
        let isBest = !best || splitMs < best;
        if (isBest) {
            this.bestSplits[this.currentSplit] = splitMs;
            GL.storage.setValue("DLD Timer", `bestSplits-${this.category}`, this.bestSplits);
        }
        if (finishIl) {
            this.ui.setTotalAhead(isBest);
            return;
        }
        // add the comparison
        let pb = this.personalBest[this.currentSplit];
        if (pb) {
            let diff = totalMs - pb;
            let ahead = totalMs < pb;
            this.ui.setFinalSplit(this.currentSplit, totalMs, diff, ahead, isBest);
            this.ui.setTotalAhead(ahead);
        }
        else {
            this.ui.setFinalSplit(this.currentSplit, totalMs);
        }
        this.splitTimes.push(totalMs);
        this.splitStart = performance.now();
        this.currentSplit++;
        // when the run is over
        if (this.currentSplit === splitNames.length) {
            this.started = false;
            this.currentSplit = splitNames.length - 1;
            let isAhead = !pb || totalMs < pb;
            this.ui.setTotalAhead(isAhead);
            // update the personal best
            if (isAhead && !finishIl) {
                this.personalBest = this.splitTimes;
                GL.storage.setValue("DLD Timer", `pb-${this.category}`, this.personalBest);
            }
            return;
        }
        // add the active class to the next split
        this.ui.setActiveSplit(this.currentSplit);
    }
    onUpdate() {
        if (!this.started)
            return;
        let now = performance.now();
        this.now = now;
        let totalMs = now - this.startTime;
        let splitMs = now - this.splitStart;
        this.ui.update(totalMs, splitMs);
    }
}

class Autosplitter {
    timer = new Timer(this);
    mode = GL.storage.getValue("DLD Timer", "mode", "Full Game");
    ilsummit = GL.storage.getValue("DLD Timer", "ilsummit", 0);
    ilPreboosts = GL.storage.getValue("DLD Timer", "ilPreboosts", false);
    couldStartLastFrame = true;
    hasMoved = false;
    loadedCorrectSummit = false;
    setMode(mode, ilsummit, ilPreboosts) {
        // set and save values
        this.mode = mode;
        GL.storage.setValue("DLD Timer", "mode", mode);
        if (ilsummit !== undefined) {
            this.ilsummit = ilsummit;
            GL.storage.setValue("DLD Timer", "ilsummit", ilsummit);
        }
        if (ilPreboosts !== undefined) {
            this.ilPreboosts = ilPreboosts;
            GL.storage.setValue("DLD Timer", "ilPreboosts", ilPreboosts);
        }
        this.couldStartLastFrame = true;
    }
    init() {
        if (document.readyState === "complete")
            this.timer.init();
        else
            document.addEventListener("DOMContentLoaded", () => this.timer.init());
        let worldManager = GL.stores.phaser.scene.worldManager;
        GL.patcher.after("DLD Timer", worldManager.physics, "physicsStep", () => {
            let input = GL.stores.phaser.scene.inputManager.getPhysicsInput();
            if (input.jump || input.angle !== null)
                this.hasMoved = true;
        });
        // whenever a frame passes check if we've reached any summits
        GL.patcher.after("DLD Timer", worldManager, 'update', () => {
            if (this.mode === "Full Game")
                this.updateFullGame();
            else if (this.ilPreboosts)
                this.updatePreboosts();
            else
                this.updateNoPreboosts();
            this.hasMoved = false;
        });
        let savestates = GL.pluginManager.getPlugin("Savestates")?.return;
        if (savestates) {
            savestates.onStateLoaded(this.onStateLoadedBound);
        }
    }
    onStateLoaded(summit) {
        if (this.mode === "Full Game")
            return;
        if (this.ilPreboosts)
            return;
        if (this.ilState !== "waiting") {
            this.reset();
        }
        this.loadedCorrectSummit = summit === this.ilsummit + 1;
    }
    onStateLoadedBound = this.onStateLoaded.bind(this);
    reset() {
        // kind of cheaty way to reset the UI
        this.timer.ui.remove();
        this.timer = new Timer(this);
        this.timer.init();
        this.summit = 0;
        this.ilState = "waiting";
        this.couldStartLastFrame = true;
        this.loadedCorrectSummit = false;
    }
    ilState = "waiting";
    updatePreboosts() {
        let body = GL.stores.phaser.mainCharacter.body;
        let coords = summitCoords[this.ilsummit];
        if (this.ilState === "waiting") {
            if (inArea(body, coords)) {
                if (this.couldStartLastFrame)
                    return;
                this.ilState = "started";
                this.timer.start(this.ilsummit);
                this.timer.onUpdate();
            }
            else {
                this.couldStartLastFrame = false;
            }
        }
        else if (this.ilState === "started") {
            // check if we've reached the end
            if (inArea(body, summitStartCoords[this.ilsummit + 1])) {
                this.timer.split(true);
                this.ilState = "completed";
                this.couldStartLastFrame = true;
            }
            this.timer.onUpdate();
        }
    }
    updateNoPreboosts() {
        if (!this.loadedCorrectSummit)
            return;
        let body = GL.stores.phaser.mainCharacter.body;
        if (this.ilState === "waiting") {
            if (this.hasMoved) {
                this.ilState = "started";
                this.timer.start(this.ilsummit);
                this.timer.onUpdate();
            }
        }
        else if (this.ilState === "started") {
            if (inArea(body, summitStartCoords[this.ilsummit + 1])) {
                this.timer.split(true);
                this.ilState = "completed";
            }
            this.timer.onUpdate();
        }
    }
    summit = 0;
    updateFullGame() {
        let body = GL.stores.phaser.mainCharacter.body;
        // check if we're at a position where we should reset
        if (this.summit > 0 && body.x < resetCoordinates.x && body.y > resetCoordinates.y) {
            this.reset();
            return;
        }
        if (this.summit > summitStartCoords.length - 1)
            return;
        if (this.summit === 0) {
            if (body.x > summitStartCoords[0].x && body.y < summitStartCoords[0].y + 10) {
                if (this.couldStartLastFrame)
                    return;
                this.summit = 1;
                this.timer.start();
            }
            else {
                this.couldStartLastFrame = false;
            }
        }
        else if (inArea(body, summitStartCoords[this.summit])) {
            this.summit++;
            this.timer.split();
        }
        this.timer.onUpdate();
    }
    destroy() {
        this.timer.ui.remove();
        let savestates = GL.pluginManager.getPlugin("Savestates")?.return;
        if (savestates) {
            savestates.offStateLoaded(this.onStateLoadedBound);
        }
    }
}

/// <reference types='gimloader' />
GL.UI.addStyles("DLD Timer", styles);
let autosplitter = new Autosplitter();
let isDestroyed = false;
onceOrIfLoaded(() => {
    if (isDestroyed)
        return;
    autosplitter.init();
});
function onStop() {
    isDestroyed = true;
    autosplitter.destroy();
    GL.UI.removeStyles("DLD Timer");
    GL.patcher.unpatchAll("DLD Timer");
}
function openSettingsMenu() {
    GL.UI.showModal(GL.React.createElement(Settings, { ui: autosplitter.timer }), {
        title: "Manage DLD Timer data",
        buttons: [{ text: "Close", style: "close" }],
        id: "DLD Timer Settings",
        style: "min-width: min(600px, 90%)"
    });
}

export { onStop, openSettingsMenu };
