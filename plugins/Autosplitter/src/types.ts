export interface BaseData {
    attempts: Record<string, number>,
    timerPosition: string
}

export interface BasicData extends BaseData {    
    pb: Record<string, number>,
}

export interface SplitsData extends BaseData {
    pb: Record<string, number[]>,
    bestSplits: Record<string, number[]>,
    showPbSplits: boolean,
    showSplits: boolean,
    showSplitTimes: boolean,
    showSplitComparisons: boolean,
    showSplitTimeAtEnd: boolean
}

export interface IlData extends SplitsData {
    ilpbs: Record<string, number>,
}

export interface DLDData extends IlData {
    mode: string,
    ilSummit: number,
    ilPreboosts: boolean,
    autostartILs: boolean,
    autoRecord: boolean
}

// No additional properties, just to be consistent
export interface FishtopiaData extends SplitsData {}

export type GamemodeData = BasicData | SplitsData;

export interface GamemodesData {
    "DLD": DLDData,
    "Fishtopia": FishtopiaData
}