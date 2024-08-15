import { DLDData, FishtopiaData } from "./types";

export function getGamemodeData(gamemode: string) {
    switch(gamemode) {
        case "DLD": return getDLDData();
        case "Fishtopia": return getFishtopiaData();
        default: throw new Error("Invalid gamemode");
    }
}

const DLDDefaults: DLDData = {
    mode: "Full Game",
    ilSummit: 0,
    ilPreboosts: false,
    autostartILs: false,
    autoRecord: true,
    attempts: {},
    pb: {},
    bestSplits: {},
    ilpbs: {},
    showPbSplits: false,
    showSplits: true,
    showSplitTimes: true,
    showSplitComparisons: true,
    showSplitTimeAtEnd: true,
    timerPosition: 'top right'
}

export function getDLDData(): DLDData {
    let data = GL.storage.getValue("Autosplitter", "DLDData", {});
    return Object.assign(DLDDefaults, data);
}

const fishtopiaDefaults: FishtopiaData = {
    attempts: {},
    pb: {},
    bestSplits: {},
    showPbSplits: false,
    showSplits: true,
    showSplitTimes: true,
    showSplitComparisons: true,
    showSplitTimeAtEnd: true,
    timerPosition: 'top right'
}

export function getFishtopiaData(): FishtopiaData {
    let data = GL.storage.getValue("Autosplitter", "FishtopiaData", {});
    return Object.assign(fishtopiaDefaults, data);
}

export function downloadFile(data: string, filename: string) {
    let blob = new Blob([data], {type: "application/json"});
    let url = URL.createObjectURL(blob);
    let a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

export function readFile() {
    return new Promise<any>((res, rej) => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".json";

        input.addEventListener("change", () => {
            let file = input.files?.[0];
            if(!file) return rej("No file selected");

            let reader = new FileReader();
            reader.onload = () => {
                let data = reader.result;
                if(typeof data !== "string") return rej("Failed to read file");

                let parsed = JSON.parse(data);
                res(parsed);
            }

            reader.readAsText(file);
        });

        input.click();
    });
}

export function onceOrIfLoaded(callback: () => void) {
    if(GL.net.type === "Colyseus") callback();
    GL.addEventListener("loadEnd", () => {
        if(GL.net.type === "Colyseus") callback();
    }, { once: true })
}

export function fmtMs(ms: number) {
    ms = Math.round(ms);
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);

    ms %= 1000;
    seconds %= 60;

    if(minutes > 0) return `${minutes}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    return `${seconds}.${String(ms).padStart(3, '0')}`;
}

export function parseTime(time: string) {
    let parts = time.split(":").map(parseFloat);
    if(parts.some(isNaN)) return 6e5;
    if(parts.length === 1) return parts[0] * 1e3;
    if(parts.length === 2) return parts[0] * 6e4 + parts[1] * 1e3;
    return parts[0] * 36e5 + parts[1] * 6e4 + parts[2] * 1e3;
}

export interface Area {
    x: number,
    y: number,
    direction: "right" | "left"
}

export interface Coords {
    x: number,
    y: number
}

export function inArea(coords: Coords, area: Area) {
    if(area.direction === "right" && coords.x < area.x) return false;
    if(area.direction === "left" && coords.x > area.x) return false;
    if(coords.y > area.y + 10) return false; // little bit of leeway
    return true;
}

export function onPhysicsStep(callback: () => void) {
    let worldManager = GL.stores.phaser.scene.worldManager;
        
    GL.patcher.after("Autosplitter", worldManager.physics, "physicsStep", () => {
        callback();
    });
}

export function onFrame(callback: () => void) {
    let worldManager = GL.stores.phaser.scene.worldManager;
        
    GL.patcher.after("Autosplitter", worldManager, "update", () => {
        callback();
    });
}