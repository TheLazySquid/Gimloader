import { SplitsAutosplitter } from "../splitters/autosplitter";
import { fmtMs } from "../util";
import BasicUI from "./basic";

export default class SplitsUI extends BasicUI {
    splitTimes: number[] = [];

    previousActiveRow: HTMLElement | null = null;
    splitRows: HTMLElement[] = [];
    splitDatas: HTMLElement[][] = [];

    activeSplit: number | null = null;

    constructor(public autosplitter: SplitsAutosplitter, public splitNames: string[]) {
        super(autosplitter);

        // create and add the splits table
        let table = document.createElement("table");
        if(this.autosplitter.data.showSplits) this.element.appendChild(table);
    
        for(let name of this.splitNames) {
            let row = document.createElement("tr");
            row.innerHTML = `
            <td style="min-width: 120px;">${name}</td>
            <td style="min-width: 60px; ${this.autosplitter.data.showSplitTimes ? "" : "display: none"}"></td>
            <td style="min-width: 80px; ${this.autosplitter.data.showSplitComparisons ? "" : "display: none"}"></td>
            <td style="min-width: 60px; ${this.autosplitter.data.showSplitTimeAtEnd ? "" : "display: none"}"></td>`;
            this.splitRows.push(row);
            this.splitDatas.push(Array.from(row.children) as HTMLElement[]);
            table.appendChild(row);
        }

        // add in the split time in the PB
        if(this.autosplitter.data.showPbSplits) {
            for(let i = 0; i < this.autosplitter.pbSplits.length; i++) {
                let split = this.autosplitter.pbSplits[i];
                if(!split) continue;

                this.splitDatas[i][3].innerText = fmtMs(split);
            }
        }
    
        this.element.appendChild(this.total);
    }

    setActiveSplit(index: number) {
        if(index >= this.splitRows.length) {
            if(this.previousActiveRow) this.previousActiveRow.classList.remove("active");
            this.activeSplit = null;
            return;
        }

        if(this.previousActiveRow) this.previousActiveRow.classList.remove("active");
        this.splitRows[index].classList.add("active");

        this.previousActiveRow = this.splitRows[index];
        this.activeSplit = index;
    }

    updateSplit(totalMs: number, splitIndex: number, splitMs: number) {
        this.splitDatas[splitIndex][1].innerText = fmtMs(splitMs);

        let pb = this.autosplitter.pbSplits?.[splitIndex];
        if(!pb) return;
        let amountBehind = totalMs - pb;
        if(amountBehind <= 0) {
            this.setTotalAhead(true);
            return;
        }

        if(this.autosplitter.data.showSplitComparisons) {
            this.splitDatas[splitIndex][2].innerText = `+${fmtMs(amountBehind)}`;
            this.splitDatas[splitIndex][2].classList.add("behind");
        }

        this.setTotalAhead(false);
    }

    finishSplit(totalMs: number, splitIndex: number, splitMs: number) {
        let els = this.splitDatas[splitIndex];
        els[3].innerText = fmtMs(totalMs);

        let pb = this.autosplitter.pbSplits[splitIndex];
        let bestSplit = this.autosplitter.bestSplits[splitIndex];
        if(!pb || !bestSplit) return;

        let ahead = pb === undefined || totalMs <= pb;
        let best = bestSplit !== undefined && splitMs < bestSplit;

        if(ahead) els[2].innerText = `-${fmtMs(-totalMs + pb)}`;
        else els[2].innerText = `+${fmtMs(totalMs - pb)}`;

        if(best) els[2].classList.add("best");
        else if(ahead) els[2].classList.add("ahead");
        else els[2].classList.add("behind");
    }
}