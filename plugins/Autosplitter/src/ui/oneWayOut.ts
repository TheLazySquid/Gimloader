import { oneWayOutSplits } from "../constants";
import { SplitsAutosplitter } from "../splitters/autosplitter";
import SplitsUI from "./splits";

export class OneWayOutUI extends SplitsUI {
    dropRateDiv: HTMLDivElement;

    constructor(public autosplitter: SplitsAutosplitter) {
        super(autosplitter, oneWayOutSplits);

        this.dropRateDiv = document.createElement("div");
        this.dropRateDiv.innerText = "0/0";
        let bar = this.element.querySelector(".bar")
        bar?.insertBefore(this.dropRateDiv, bar?.firstChild);
    }

    setDropRate(rate: string) {
        this.dropRateDiv.innerText = rate;
    }
}