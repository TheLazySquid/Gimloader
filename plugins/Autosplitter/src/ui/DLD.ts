import { categories, DLDSplits } from "../constants";
import DLDAutosplitter from "../splitters/DLD";
import BasicUI from "./basic";
import SplitsUI from "./splits";
// @ts-ignore
import restore from '../../assets/restore.svg';

function addDLDUI(element: HTMLElement, autosplitter: DLDAutosplitter) {
    let topBar = element.querySelector(".bar")!;

    // make the category selector
    let categorySelect = document.createElement("select");
    topBar.firstChild!.before(categorySelect);
    for(let category of categories) {
        let option = document.createElement("option");
        option.value = category;
        option.innerText = category;
        if(category === autosplitter.category) option.selected = true;
        categorySelect.appendChild(option);
    }

    // make the run type selector
    let runTypeBar = document.createElement("div");
    runTypeBar.classList.add("bar");

    let runTypeSelect = document.createElement("select");
    runTypeSelect.innerHTML = `<option value="Full Game">Full Game</option>`
    for(let i = 0; i < DLDSplits.length; i++) {
        let option = document.createElement("option");
        option.value = String(i);
        option.innerText = DLDSplits[i];
        if(autosplitter.data.mode === "Summit" && autosplitter.data.ilSummit === i) option.selected = true;
        runTypeSelect.appendChild(option);
    }
    runTypeBar.appendChild(runTypeSelect);

    let preboostSelect = document.createElement("select");
    preboostSelect.innerHTML = `
    <option value="false">No Preboosts</option>
    <option value="true">Preboosts</option>`
    preboostSelect.value = String(autosplitter.data.ilPreboosts);

    if(autosplitter.category === "Current Patch") preboostSelect.disabled = true;

    // add events to the selectors
    categorySelect.addEventListener("change", () => {
        autosplitter.setCategory(categorySelect.value);

        // there isn't a preboosts option for current patch
        if(categorySelect.value === "Current Patch") {
            preboostSelect.value = "false";
            preboostSelect.disabled = true;
        } else {
            preboostSelect.disabled = false;
        }
    });

    if(runTypeSelect.value !== "Full Game") {
        runTypeBar.appendChild(preboostSelect);
    }

    runTypeSelect.addEventListener("change", () => {
        if(runTypeSelect.value === "Full Game") {
            preboostSelect.remove();
            autosplitter.setMode("Full Game");
        } else {
            runTypeBar.appendChild(preboostSelect);
            autosplitter.setMode("Summit", parseInt(runTypeSelect.value), preboostSelect.value === "true");
        }
    });

    preboostSelect.addEventListener("change", () => {
        autosplitter.setMode("Summit", parseInt(runTypeSelect.value), preboostSelect.value === "true");
    });

    topBar.after(runTypeBar);
}

function lockInCategory(element: HTMLElement, autosplitter: DLDAutosplitter) {
    let selects = element.querySelectorAll("select");
    for(let select of selects) {
        select.disabled = true; 
        select.title = "Cannot be altered mid-run";
    }

    let resetButton = document.createElement("button");
    resetButton.classList.add("restart");
    resetButton.innerHTML = restore;

    resetButton.addEventListener("click", () => {
        autosplitter.reset();
    });

    element.firstChild?.firstChild?.before(resetButton);
}

export class DLDFullGameUI extends SplitsUI {
    constructor(public autosplitter: DLDAutosplitter) {
        super(autosplitter, DLDSplits);

        addDLDUI(this.element, autosplitter);
    }

    lockInCategory() {
        lockInCategory(this.element, this.autosplitter);
    }
}

export class DLDSummitUI extends BasicUI {
    constructor(public autosplitter: DLDAutosplitter) {
        super(autosplitter);

        addDLDUI(this.element, autosplitter);
    }

    lockInCategory() {
        lockInCategory(this.element, this.autosplitter);
    }
}