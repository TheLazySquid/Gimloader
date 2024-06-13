export enum Keycodes {
    LeftArrow = 37,
    RightArrow = 39,
    UpArrow = 38,
    W = 87,
    A = 65,
    D = 68,
    Space = 32
}

export interface IFrameInfo {
    right: boolean;
    left: boolean;
    up: boolean;
}

export interface IRecording {
    startPos: { x: number, y: number };
    startState: string;
    frames: IFrameInfo[];
}