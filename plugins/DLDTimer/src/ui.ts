import { categories, splitNames } from "./constants";
import { fmtMs } from "./util";

export default class UI {
    element: HTMLElement;
    total: HTMLElement;
    splitRows: HTMLElement[] = [];
    splitDatas: HTMLElement[][] = [];
    attemptsEl: HTMLElement;
    select: HTMLSelectElement;

    attempts = 0;
    category: string = "Current Patch";
    startTime: number;
    splitStart: number;
    started = false;
    currentSplit = 0;
    now = 0;
    
    splitTimes: number[] = [];
    bestSplits: number[] = [];
    personalBest: number[] = [];

    create() {
        this.category = "Current Patch";
        if(GL.pluginManager.isEnabled("BringBackBoosts")) {
            if(GL.storage.getValue("BringBackBoosts", "useOriginalPhysics", false)) {
                this.category = "Original Physics";
            } else {
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
        for(let category of categories) {
            let option = document.createElement("option");
            option.value = category;
            option.innerText = category;
            if(category === this.category) option.selected = true;
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

        for(let name of splitNames) {
            let row = document.createElement("tr");
            row.innerHTML = `
            <td style="min-width: 120px;">${name}</td>
            <td style="min-width: 60px;"></td>
            <td class="comparison" style="min-width: 80px;"></td>
            <td style="min-width: 60px;"></td>`;
            this.splitRows.push(row);
            this.splitDatas.push(Array.from(row.children) as HTMLElement[]);
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

        if(isBest) {
            this.bestSplits[this.currentSplit] = splitMs;
            GL.storage.setValue("DLD Timer", `bestSplits-${this.category}`, this.bestSplits);
        }

        // add the comparison
        let pb = this.personalBest[this.currentSplit];
        if(pb) {
            let diff = totalMs - pb;
            let ahead = totalMs < pb;
            let str: string;

            if(ahead) str = `-${fmtMs(-diff)}`;
            else str = `+${fmtMs(diff)}`;

            els[2].innerText = str;
            if(isBest) els[2].classList.add("best");
            else if(ahead) els[2].classList.add("ahead");
            else els[2].classList.add("behind");

            if(ahead) this.total.classList.add("ahead");
            else this.total.classList.add("behind");
        }

        this.splitTimes.push(totalMs);

        this.splitStart = performance.now();
        this.currentSplit++;

        // when the run is over
        if(this.currentSplit === splitNames.length) {
            this.started = false;
            this.currentSplit = splitNames.length - 1;
            
            let isAhead = !pb || totalMs < pb;
            this.total.classList.add(isAhead ? "ahead" : "behind");

            // update the personal best
            if(isAhead) {
                this.personalBest = this.splitTimes;
                GL.storage.setValue("DLD Timer", `pb-${this.category}`, this.personalBest);
            }

            return;
        }

        // add the active class to the next split
        this.splitRows[this.currentSplit].classList.add("active");
    }

    onUpdate() {
        if(!this.started) return;
        let now = performance.now();
        this.now = now;
        let totalMs = now - this.startTime;
        let splitMs = now - this.splitStart;

        this.total.innerText = fmtMs(totalMs);
        this.splitDatas[this.currentSplit][1].innerText = fmtMs(splitMs);

        let pb = this.personalBest[this.currentSplit];
        if(pb) {
            let amountBehind = totalMs - pb;
            if(amountBehind > 0) {
                this.splitDatas[this.currentSplit][2].innerText = `+${fmtMs(amountBehind)}`;
                this.splitDatas[this.currentSplit][2].classList.add("behind");
            }
        }
    }

    remove() {
        this.element?.remove();
    }
}