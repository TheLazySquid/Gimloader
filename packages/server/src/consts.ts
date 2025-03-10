import fs from 'fs';
import { PhysicsState } from './types.js';

export const expressPort = 5823;
export const colyseusPort = 5824;
export const worldOptions = JSON.parse(fs.readFileSync("./data/worldOptions.json").toString());
export const propOptions = JSON.parse(fs.readFileSync("./data/propOptions.json").toString());
export const defaultPhysicsState: PhysicsState = {
    gravity: 0.001,
    velocity: { x: 0, y: 0, desiredX: 0, desiredY: 0.001 }, 
    movement: { direction: "none", xVelocity: 0, accelerationTicks: 0 },
    jump: { isJumping: false, jumpsLeft: 1, jumpCounter: 0, jumpTicks: 1, xVelocityAtJumpStart: 0 },
    forces: [],
    grounded: false,
    groundedTicks: 1,
    lastGroundedAngle: 0
}