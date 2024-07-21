import type Autosplitter from "./autosplitter";
import { splitNames } from "./constants";
import UI from "./ui";

export default class Timer {
    autosplitter: Autosplitter;
    ui: UI;

    attempts = 0;
    startTime: number;
    splitStart: number;
    started = false;
    currentSplit = 0;
    now = 0;
    
    splitTimes: number[] = [];
    bestSplits: number[] = [];
    personalBest: number[] = [];
    ilPb: number | null = null;
    
    constructor(autosplitter: Autosplitter) {
        this.autosplitter = autosplitter;
        this.ui = new UI(this);
    }

    getModeId() {
        if(this.autosplitter.mode === "Full Game") return this.autosplitter.category;
        if(this.autosplitter.ilPreboosts) return `${this.autosplitter.category}-${this.autosplitter.ilsummit}-preboosts`;
        return `${this.autosplitter.category}-${this.autosplitter.ilsummit}`;
    }

    init() {
        this.loadModeData();

        this.ui.create();
    }

    loadModeData() {
        this.attempts = GL.storage.getValue("DLD Timer", `attempts-${this.getModeId()}`, 0);

        if(this.autosplitter.mode == "Full Game") {
            this.personalBest = GL.storage.getValue("DLD Timer", `pb-${this.getModeId()}`, []);
            this.bestSplits = GL.storage.getValue("DLD Timer", `bestSplits-${this.getModeId()}`, []);
        } else {
            this.ilPb = GL.storage.getValue("DLD Timer", `ilpb-${this.getModeId()}`, null);
        }
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
        GL.storage.setValue("DLD Timer", `attempts-${this.getModeId()}`, this.attempts);

        this.ui.setTotalAhead(true);
    }

    updateCategory(name: string) {
        this.autosplitter.category = name;
        this.loadModeData();
        this.ui.setAttempts(this.attempts);
    }

    finishIl() {
        let ms = this.now - this.startTime;
        
        if(!this.ilPb || ms < this.ilPb) {
            this.ilPb = ms;
            GL.storage.setValue("DLD Timer", `ilpb-${this.getModeId()}`, this.ilPb);
        }
    }

    split() {
        // add the comparison and total time
        let totalMs = this.now - this.startTime;

        let splitMs = totalMs - (this.splitTimes[this.splitTimes.length - 1] ?? 0);
        let best = this.bestSplits[this.currentSplit];
        let isBest = !best || splitMs < best;

        if(isBest) {
            this.bestSplits[this.currentSplit] = splitMs;
            GL.storage.setValue("DLD Timer", `bestSplits-${this.getModeId()}`, this.bestSplits);
        }

        // add the comparison
        let pb = this.personalBest[this.currentSplit];
        if(pb) {
            let diff = totalMs - pb;
            let ahead = totalMs < pb;

            this.ui.setFinalSplit(this.currentSplit, totalMs, diff, ahead, isBest);
            let next = this.personalBest[this.currentSplit + 1];
            if(next) {
                let reallyBehind = totalMs > next;
                this.ui.setTotalAhead(!reallyBehind);
            }
        } else {
            this.ui.setFinalSplit(this.currentSplit, totalMs);
        }


        this.splitTimes.push(totalMs);

        this.splitStart = performance.now();
        this.currentSplit++;

        // when the run is over
        if(this.currentSplit === splitNames.length) {
            this.started = false;
            this.currentSplit = splitNames.length - 1;
            
            let isAhead = !pb || totalMs < pb;
            this.ui.setTotalAhead(isAhead);

            // update the personal best
            if(isAhead) {
                this.personalBest = this.splitTimes;
                GL.storage.setValue("DLD Timer", `pb-${this.getModeId()}`, this.personalBest);
            }

            return;
        }

        // add the active class to the next split
        this.ui.setActiveSplit(this.currentSplit);
    }

    onUpdate() {
        if(!this.started) return;
        let now = performance.now();
        this.now = now;

        let totalMs = now - this.startTime;
        let splitMs = now - this.splitStart;

        this.ui.update(totalMs, splitMs);
    }
}