import type Autosplitter from "./autosplitter";
import { categories, splitNames } from "./constants";
import type Timer from "./timer";
import { fmtMs } from "./util";
// @ts-ignore
import restore from '../assets/restore.svg';

export default class UI {
    timer: Timer;
    autosplitter: Autosplitter;

    element: HTMLElement;
    total: HTMLElement;
    splitRows: HTMLElement[] = [];
    splitDatas: HTMLElement[][] = [];
    attemptsEl: HTMLElement;

    showSplits = GL.storage.getValue("DLD Timer", "showSplits", true);
    showSplitTimes = GL.storage.getValue("DLD Timer", "showSplitTimes", true);
    showSplitComparisons = GL.storage.getValue("DLD Timer", "showSplitComparisons", true);
    showSplitTimeAtEnd = GL.storage.getValue("DLD Timer", "showSplitTimeAtEnd", true);

    constructor(timer: Timer) {
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
        for(let category of categories) {
            let option = document.createElement("option");
            option.value = category;
            option.innerText = category;
            if(category === this.autosplitter.category) option.selected = true;
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
        runTypeSelect.innerHTML = `<option value="Full Game">Full Game</option>`
        for(let i = 0; i < splitNames.length; i++) {
            let option = document.createElement("option");
            option.value = String(i);
            option.innerText = splitNames[i];
            if(this.autosplitter.mode === "Summit" && this.autosplitter.ilsummit === i) option.selected = true;
            runTypeSelect.appendChild(option);
        }
        runTypeBar.appendChild(runTypeSelect);

        let preboostSelect = document.createElement("select");
        preboostSelect.innerHTML = `
        <option value="false">No Preboosts</option>
        <option value="true">Preboosts</option>`
        preboostSelect.value = String(this.autosplitter.ilPreboosts);

        if(this.autosplitter.category === "Current Patch") preboostSelect.disabled = true;

        this.element.appendChild(topBar);
        this.element.appendChild(runTypeBar);

        let table = document.createElement("table");
        if(this.showSplits) this.element.appendChild(table);

        for(let name of splitNames) {
            let row = document.createElement("tr");
            row.innerHTML = `
            <td style="min-width: 120px;">${name}</td>
            <td style="min-width: 60px; ${this.showSplitTimes ? "" : "display: none"}"></td>
            <td style="min-width: 80px; ${this.showSplitComparisons ? "" : "display: none"}"></td>
            <td style="min-width: 60px; ${this.showSplitTimeAtEnd ? "" : "display: none"}"></td>`;
            this.splitRows.push(row);
            this.splitDatas.push(Array.from(row.children) as HTMLElement[]);
            table.appendChild(row);
        }

        this.element.appendChild(this.total);
        document.body.appendChild(this.element);

        // update the category when the select changes
        categorySelect.addEventListener("change", () => {
            this.timer.updateCategory(categorySelect.value);

            // there isn't a preboosts option for current patch
            if(categorySelect.value === "Current Patch") {
                preboostSelect.value = "false";
                preboostSelect.disabled = true;
            } else {
                preboostSelect.disabled = false;
            }
        });

        if(runTypeSelect.value !== "Full Game") {
            table.style.display = "none";
            runTypeBar.appendChild(preboostSelect);
        }

        runTypeSelect.addEventListener("change", () => {
            if(runTypeSelect.value === "Full Game") {
                table.style.display = "";
                preboostSelect.remove();
                this.autosplitter.setMode("Full Game");
            } else {
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

    update(totalMs: number, splitMs: number) {
        this.total.innerText = fmtMs(totalMs);
        this.splitDatas[this.timer.currentSplit][1].innerText = fmtMs(splitMs);

        if(this.autosplitter.mode === "Full Game") {
            let pb = this.timer.personalBest[this.timer.currentSplit];
            if(!pb) return;

            let amountBehind = totalMs - pb;
            if(amountBehind > 0) {
                if(this.showSplitComparisons) {
                    this.splitDatas[this.timer.currentSplit][2].innerText = `+${fmtMs(amountBehind)}`;
                    this.splitDatas[this.timer.currentSplit][2].classList.add("behind");
                }
                this.setTotalAhead(false);
            }
        } else {
            let pb = this.timer.ilPb;
            if(!pb) return;

            let amountBehind = totalMs - pb;
            if(amountBehind > 0) {
                this.setTotalAhead(false);
            }
        }
    }

    setFinalSplit(split: number, totalMs: number, diff?: number, ahead?: boolean, best?: boolean) {
        let els = this.splitDatas[split];
        els[3].innerText = fmtMs(totalMs);

        if(!this.showSplitComparisons) return;
        if(diff === undefined || ahead === undefined || best === undefined) return;
        let str: string;

        if(ahead) str = `-${fmtMs(-diff)}`;
        else str = `+${fmtMs(diff)}`;

        els[2].innerText = str;
        if(best) els[2].classList.add("best");
        else if(ahead) els[2].classList.add("ahead");
        else els[2].classList.add("behind");
    }

    lockInCategory() {
        let selects = this.element.querySelectorAll("select");
        for(let select of selects) {
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
    
    setTotalAhead(ahead: boolean) {
        this.total.classList.toggle("ahead", ahead);
        this.total.classList.toggle("behind", !ahead);
    }

    lastActiveRow: HTMLElement | null = null;

    setActiveSplit(split: number | null) {
        if(this.lastActiveRow) this.lastActiveRow.classList.remove("active");
        if(split === null) return;

        this.splitRows[split].classList.add("active");
        this.lastActiveRow = this.splitRows[split];
    }

    setAttempts(attempts: number) {
        this.attemptsEl.innerText = String(attempts);
    }

    remove() {
        this.element?.remove();
    }
}