import { Autosplitter } from "../splitters/autosplitter";
import { fmtMs } from "../util";

export default class BasicUI {
    element: HTMLElement;
    total: HTMLElement;
    attemptsEl: HTMLElement;

    constructor(public autosplitter: Autosplitter) {
        this.element = document.createElement("div");
        this.element.id = "timer";

        this.element.className = autosplitter.data.timerPosition;
    
        let topBar = document.createElement("div");
        topBar.classList.add("bar");        
        // make the attempts counter
        this.attemptsEl = document.createElement("div");
        this.attemptsEl.classList.add("attempts");
        this.attemptsEl.innerText = autosplitter.attempts.toString();
        topBar.appendChild(this.attemptsEl);
        this.element.appendChild(topBar);
    
        // make the total timer
        this.total = document.createElement("div");
        this.total.classList.add("total");
        this.total.innerText = "0.00";
        this.element.appendChild(this.total);
    
        document.body.appendChild(this.element);
    }

    start() {
        this.setTotalAhead(true);
    }
    
    update(totalMs: number) {
        this.total.innerText = fmtMs(totalMs);

        if(this.autosplitter.pb) {
            let amountBehind = totalMs - this.autosplitter.pb;
            if(amountBehind > 0) this.setTotalAhead(false);
        }
    }

    setTotalAhead(ahead: boolean) {
        this.total.classList.toggle("ahead", ahead);
        this.total.classList.toggle("behind", !ahead);
    }

    updateAttempts() {
        this.attemptsEl.innerText = this.autosplitter.attempts.toString();
    }

    remove() {
        this.element?.remove();
    }
}