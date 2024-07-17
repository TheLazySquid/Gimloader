/**
 * @name DLD Timer
 * @description Times DLD runs, and shows you your time for each summit
 * @author TheLazySquid
 * @version 1.0.0
 */
const summitCoordinates = [
    { x: 9071, y: 65000, direction: "right" }, // summit 1
    { x: 28788.9, y: 53278, direction: "left" }, // summit 2
    { x: 21387.95, y: 50078, direction: "right" }, // summit 3
    { x: 39693.5, y: 41374, direction: "right" }, // summit 4
    { x: 35212, y: 35166, direction: "right" }, // summit 5
    { x: 39755.93, y: 28573, direction: "right" }, // summit 6
    { x: 40395.91, y: 13854, direction: "right" } // finish
];
const resetCoordinates = { x: 9050, y: 6300 };
const splitNames = ["Summit 1", "Summit 2", "Summit 3", "Summit 4", "Summit 5", "Summit 6"];
const categories = ["Current Patch", "Creative Platforming Patch", "Original Physics"];

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

class UI {
    element;
    total;
    splitRows = [];
    splitDatas = [];
    attemptsEl;
    select;
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
    create() {
        this.category = "Current Patch";
        if (GL.pluginManager.isEnabled("BringBackBoosts")) {
            if (GL.storage.getValue("BringBackBoosts", "useOriginalPhysics", false)) {
                this.category = "Original Physics";
            }
            else {
                this.category = "Creative Platforming Patch";
            }
        }
        this.personalBest = GL.storage.getValue("DLD Timer", `pb-${this.category}`, []);
        this.bestSplits = GL.storage.getValue("DLD Timer", `bestSplits-${this.category}`, []);
        this.element = document.createElement("div");
        this.element.id = "timer";
        this.total = document.createElement("div");
        this.total.classList.add("total");
        this.total.innerText = "0.00";
        let topBar = document.createElement("div");
        topBar.classList.add("topBar");
        // make the category selector
        this.select = document.createElement("select");
        topBar.appendChild(this.select);
        for (let category of categories) {
            let option = document.createElement("option");
            option.value = category;
            option.innerText = category;
            if (category === this.category)
                option.selected = true;
            this.select.appendChild(option);
        }
        this.select.addEventListener("keydown", (e) => e.preventDefault());
        // update the category when the select changes
        this.select.addEventListener("change", () => {
            this.category = this.select.value;
            this.attempts = GL.storage.getValue("DLD Timer", `attempts-${this.category}`, 0);
            this.attemptsEl.innerText = String(this.attempts);
            this.personalBest = GL.storage.getValue("DLD Timer", `pb-${this.category}`, []);
            this.bestSplits = GL.storage.getValue("DLD Timer", `bestSplits-${this.category}`, []);
        });
        // make the attempts counter
        this.attemptsEl = document.createElement("div");
        this.attemptsEl.classList.add("attempts");
        this.attempts = GL.storage.getValue("DLD Timer", `attempts-${this.category}`, 0);
        this.attemptsEl.innerText = String(this.attempts);
        topBar.appendChild(this.attemptsEl);
        this.element.appendChild(topBar);
        let table = document.createElement("table");
        this.element.appendChild(table);
        this.element.appendChild(this.total);
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
        document.body.appendChild(this.element);
    }
    start() {
        this.startTime = performance.now();
        this.splitStart = this.startTime;
        this.started = true;
        this.currentSplit = 0;
        this.splitRows[0].classList.add("active");
        // replace the selector with a div
        let div = document.createElement("div");
        div.innerText = this.category;
        this.select.replaceWith(div);
        // increment the attempts
        this.attempts++;
        this.attemptsEl.innerText = String(this.attempts);
        GL.storage.setValue("DLD Timer", `attempts-${this.category}`, this.attempts);
    }
    split() {
        // remove the active class from the previous split
        this.splitRows[this.currentSplit].classList.remove("active");
        // add the comparison and total time
        let els = this.splitDatas[this.currentSplit];
        let totalMs = this.now - this.startTime;
        els[3].innerText = fmtMs(totalMs);
        let splitMs = totalMs - (this.splitTimes[this.splitTimes.length - 1] ?? 0);
        let best = this.bestSplits[this.currentSplit];
        let isBest = !best || splitMs < best;
        if (isBest) {
            this.bestSplits[this.currentSplit] = splitMs;
            GL.storage.setValue("DLD Timer", `bestSplits-${this.category}`, this.bestSplits);
        }
        // add the comparison
        let pb = this.personalBest[this.currentSplit];
        if (pb) {
            let diff = totalMs - pb;
            let ahead = totalMs < pb;
            let str;
            if (ahead)
                str = `-${fmtMs(-diff)}`;
            else
                str = `+${fmtMs(diff)}`;
            els[2].innerText = str;
            if (isBest)
                els[2].classList.add("best");
            else if (ahead)
                els[2].classList.add("ahead");
            else
                els[2].classList.add("behind");
            if (ahead)
                this.total.classList.add("ahead");
            else
                this.total.classList.add("behind");
        }
        this.splitTimes.push(totalMs);
        this.splitStart = performance.now();
        this.currentSplit++;
        // when the run is over
        if (this.currentSplit === splitNames.length) {
            this.started = false;
            this.currentSplit = splitNames.length - 1;
            let isAhead = !pb || totalMs < pb;
            this.total.classList.add(isAhead ? "ahead" : "behind");
            // update the personal best
            if (isAhead) {
                this.personalBest = this.splitTimes;
                GL.storage.setValue("DLD Timer", `pb-${this.category}`, this.personalBest);
            }
            return;
        }
        // add the active class to the next split
        this.splitRows[this.currentSplit].classList.add("active");
    }
    onUpdate() {
        if (!this.started)
            return;
        let now = performance.now();
        this.now = now;
        let totalMs = now - this.startTime;
        let splitMs = now - this.splitStart;
        this.total.innerText = fmtMs(totalMs);
        this.splitDatas[this.currentSplit][1].innerText = fmtMs(splitMs);
        let pb = this.personalBest[this.currentSplit];
        if (pb) {
            let amountBehind = totalMs - pb;
            if (amountBehind > 0) {
                this.splitDatas[this.currentSplit][2].innerText = `+${fmtMs(amountBehind)}`;
                this.splitDatas[this.currentSplit][2].classList.add("behind");
            }
        }
    }
    remove() {
        this.element?.remove();
    }
}

var styles = "#timer {\n  position: absolute;\n  top: 0;\n  right: 0;\n  background-color: rgba(0, 0, 0, 0.85);\n  color: white;\n  z-index: 999999999;\n}\n#timer .topBar {\n  display: flex;\n  align-items: center;\n  padding: 5px 10px;\n}\n#timer select {\n  background: transparent;\n}\n#timer option {\n  background-color: black;\n}\n#timer tr:nth-child(even) {\n  background-color: rgba(255, 255, 255, 0.12);\n}\n#timer tr.active {\n  background-color: rgba(28, 145, 235, 0.864);\n}\n#timer td:first-child {\n  padding-left: 10px;\n}\n#timer .attempts {\n  flex-grow: 1;\n  text-align: right;\n}\n#timer .total {\n  font-size: xx-large;\n  width: 100%;\n  text-align: right;\n}\n#timer .ahead {\n  color: green;\n}\n#timer .behind {\n  color: red;\n}\n#timer .best {\n  color: gold;\n}\n\n#DLDTimer-settings .category {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}";

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

/// <reference types='gimloader' />
GL.UI.addStyles("DLD Timer", styles);
let ui = new UI();
let isDestroyed = false;
onceOrIfLoaded(() => {
    if (isDestroyed)
        return;
    if (document.readyState === "complete")
        ui.create();
    else
        document.addEventListener("DOMContentLoaded", () => ui.create());
    let worldManager = GL.stores.phaser.scene.worldManager;
    let body = GL.stores.phaser.mainCharacter.body;
    let summit = 0;
    // whenever a frame passes check if we've reached any summits
    GL.patcher.after("DLD Timer", worldManager, 'update', () => {
        // check if we're at a position where we should reset
        if (summit > 0 && body.x < resetCoordinates.x && body.y > resetCoordinates.y) {
            // kind of cheaty way to reset the UI
            ui.remove();
            ui = new UI();
            ui.create();
            summit = 0;
            return;
        }
        if (summit > summitCoordinates.length - 1)
            return;
        if (summit === 0) {
            if (body.x > summitCoordinates[0].x && body.y < summitCoordinates[0].y + 10) {
                summit = 1;
                ui.start();
            }
        }
        else if (((summitCoordinates[summit].direction === "right" &&
            body.x > summitCoordinates[summit].x) ||
            (summitCoordinates[summit].direction === "left" &&
                body.x < summitCoordinates[summit].x)) &&
            body.y < summitCoordinates[summit].y + 10) {
            summit++;
            ui.split();
        }
        ui.onUpdate();
    });
});
function onStop() {
    isDestroyed = true;
    ui.remove();
    GL.UI.removeStyles("DLD Timer");
    GL.patcher.unpatchAll("DLD Timer");
}
function openSettingsMenu() {
    GL.UI.showModal(GL.React.createElement(Settings, { ui }), {
        title: "Manage DLD Timer data",
        buttons: [{ text: "Close", style: "close" }],
        id: "DLD Timer Settings",
        style: "min-width: min(600px, 90%)"
    });
}

export { onStop, openSettingsMenu };
