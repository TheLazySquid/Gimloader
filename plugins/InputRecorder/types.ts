export interface IFrameInfo {
    angle: number | null;
    jump: boolean;
    _jumpKeyPressed: boolean;
}

export interface IRecording {
    startPos: { x: number, y: number };
    startState: string;
    platformerPhysics: string;
    frames: IFrameInfo[];
}