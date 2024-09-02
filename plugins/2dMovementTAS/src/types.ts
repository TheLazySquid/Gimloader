export interface IFrame {
    angle: number;
    moving: boolean;
    answer: boolean;
    purchase: boolean;
}

export interface EasyAccessWritable<T> {
    value: T;
    subscribe: (callback: (val: T) => void) => () => void;
    set: (val: T) => void;
}

export interface IPreviousFrame {
    position: { x: number, y: number };
    state: string;
    energy: number;
    speed: number;
    epq: number;
    energyUsage: number;
    energyTimeout: number;
    purchaseTimeouts: [number, () => Function, boolean?][];
    energyFrames: number[];
    maxEnergy: number;
    undoDeviceChanges?: Function;
}