import { Area } from "./util";

export const gamemodes = ["DLD", "Fishtopia"];
export const DLDSplits = ["Summit 1", "Summit 2", "Summit 3", "Summit 4", "Summit 5", "Summit 6"];
export const fishtopiaSplits = ["Fishtopia", "Purple Pond", "Sandy Shores", "Cosmic Cove", "Lucky Lake"];

// Fishtopia
export const boatChannels = [
    "attempt travel purple pond",
    "attempt travel sandy shores",
    "attempt travel cosmic cove",
    "attempt travel lucky lake"
]

// DLD
export const summitStartCoords: Area[] = [
    { x: 9071, y: 65000, direction: "right" }, // summit 1
    { x: 28788.9, y: 53278, direction: "left" }, // summit 2
    { x: 21387.95, y: 50078, direction: "right" }, // summit 3
    { x: 39693.5, y: 41374, direction: "right" }, // summit 4
    { x: 35212, y: 35166, direction: "right" }, // summit 5
    { x: 39755.93, y: 28573, direction: "right" }, // summit 6
    { x: 40395.91, y: 13854, direction: "right" } // finish
];

export const summitCoords: Area[] = [ {
    x: 9022.997283935547,
    y: 63837.7685546875,
    direction: "right"
}, {
    x: 28544.000244140625,
    y: 53278.0029296875,
    direction: "left"
}, {
    x: 21755.00030517578,
    y: 50077.99987792969,
    direction: "right"
}, {
    x: 40033.99963378906,
    y: 41373.9990234375,
    direction: "right"
}, {
    x: 35654.00085449219,
    y: 35166.00036621094,
    direction: "right"
}, {
    x: 40126.99890136719,
    y: 28573.9990234375,
    direction: "right"
}]

export const resetCoordinates = { x: 9050, y: 6300 };

export const categories = ["Current Patch", "Creative Platforming Patch", "Original Physics"];