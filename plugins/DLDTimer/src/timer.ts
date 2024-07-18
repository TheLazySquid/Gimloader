import type Autosplitter from "./autosplitter";
import { splitNames } from "./constants";
import UI from "./ui";

export default class Timer {
    autosplitter: Autosplitter;
    ui: UI;

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
    
    constructor(autosplitter: Autosplitter) {
        this.autosplitter = autosplitter;
        this.ui = new UI(this);
    }

    init() {
        this.category = "Current Patch";
        if(GL.pluginManager.isEnabled("BringBackBoosts")) {
            if(GL.storage.getValue("BringBackBoosts", "useOriginalPhysics", false)) {
                this.category = "Original Physics";
            } else {
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

    updateCategory(name: string) {
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

        if(isBest) {
            this.bestSplits[this.currentSplit] = splitMs;
            GL.storage.setValue("DLD Timer", `bestSplits-${this.category}`, this.bestSplits);
        }

        if(finishIl) {
            this.ui.setTotalAhead(isBest);
            return;
        }

        // add the comparison
        let pb = this.personalBest[this.currentSplit];
        if(pb) {
            let diff = totalMs - pb;
            let ahead = totalMs < pb;

            this.ui.setFinalSplit(this.currentSplit, totalMs, diff, ahead, isBest);
            this.ui.setTotalAhead(ahead);
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
            if(isAhead && !finishIl) {
                this.personalBest = this.splitTimes;
                GL.storage.setValue("DLD Timer", `pb-${this.category}`, this.personalBest);
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