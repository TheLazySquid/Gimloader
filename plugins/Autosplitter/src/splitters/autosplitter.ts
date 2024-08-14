import { BasicData, GamemodeData, SplitsData } from "../types";
import { getGamemodeData } from "../util";

export abstract class Autosplitter {
    data: GamemodeData;

    constructor(public id: string) {
        this.loadData();
    }

    loadData() {
        this.data = getGamemodeData(this.id);
    }

    save() {
        GL.storage.setValue("Autosplitter", `${this.id}Data`, this.data);
    }

    get attempts() {
        return this.data.attempts[this.getCategoryId()] ?? 0;
    }

    addAttempt() {
        this.data.attempts[this.getCategoryId()] = this.attempts + 1;
        this.save();
    }

    abstract get pb(): number | undefined;

    abstract getCategoryId(): string;
    abstract destroy(): void;
    abstract reset(): void;
}

export abstract class BasicAutosplitter extends Autosplitter {
    declare data: BasicData;

    get pb() {
        return this.data.pb[this.getCategoryId()];
    }
}

export abstract class SplitsAutosplitter extends Autosplitter {
    declare data: SplitsData;

    get pb() {
        let pb = this.data.pb[this.getCategoryId()];
        if(pb) return pb[pb.length - 1];
    }

    get pbSplits(): number[] {
        let categoryId = this.getCategoryId();
        if(!this.data.pb[categoryId]) this.data.pb[categoryId] = [];
        return this.data.pb[this.getCategoryId()];
    }

    get bestSplits(): number[] {
        let categoryId = this.getCategoryId();
        if(!this.data.bestSplits[categoryId]) this.data.bestSplits[categoryId] = [];
        return this.data.bestSplits[this.getCategoryId()];
    }
}