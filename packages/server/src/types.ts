export interface DeviceInfo {
    id: string;
    x: number;
    y: number;
    depth: number;
    layer: string;
    deviceId: string;
    options: Record<string, any>;
}

export interface TileInfo {
    x: number;
    y: number;
    terrain: string;
    depth: number;
    collides: boolean;
}

export interface CodeGrid {
    json: any;
    triggerType: string;
    triggerValue?: string;
    createdAt: number;
    updatedAt: number;
}

type MapStyle = "platformer" | "topDown";

export interface MapInfo {
    mapStyle: MapStyle;
    codeGrids: Record<string, Record<string, CodeGrid>>;
    devices: DeviceInfo[];
    tiles: TileInfo[];
}

export interface CharacterOptions {
    id: string;
    name: string;
    x: number;
    y: number;
    infiniteAmmo: boolean;
}

export interface SessionOptions {
    gameOwnerId: string;
    mapStyle: string;
}

export interface StateOptions {
    gameCode: string;
    ownerId: string;
    map: MapInfo;
    mapSettings: Record<string, any>;
}

export interface PhysicsState {
    gravity: number;
    velocity: { x: number; y: number; desiredX: number; desiredY: number };
    movement: { direction: string; xVelocity: number; accelerationTicks: number };
    jump: { isJumping: boolean; jumpsLeft: number; jumpCounter: number; jumpTicks: number; xVelocityAtJumpStart: number };
    forces: any[]; // TODO
    grounded: boolean;
    groundedTicks: number;
    lastGroundedAngle: number;
}