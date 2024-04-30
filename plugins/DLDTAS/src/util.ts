import { IFrameInfo } from "../types";

export const defaultState = '{"gravity":0.001,"velocity":{"x":0,"y":0},"movement":{"direction":"none","xVelocity":0,"accelerationTicks":0},"jump":{"isJumping":false,"jumpsLeft":2,"jumpCounter":0,"jumpTicks":118,"xVelocityAtJumpStart":0},"forces":[],"grounded":true,"groundedTicks":0,"lastGroundedAngle":0}'

export function generatePhysicsInput(frame: IFrameInfo, lastFrame?: IFrameInfo) {
    let jump = frame.up && !lastFrame?.up;

    /* The angle is determined like so: 0 for right, 180 for left etc.
    If two opposing keys are pressed, it is null. Otherwise it will be in between, so 45 for down + right
    If three or more keys are pressed up and left take precedence over their opposite one.*/
    let angle: number | null = null;

    // none pressed
    if(!frame.right && !frame.left && !frame.up) angle = null;

    // one pressed
    else if(frame.right && !frame.left && !frame.up) angle = 0;
    else if(!frame.right && frame.left && !frame.up) angle = 180;
    else if(!frame.right && !frame.left && frame.up) angle = 270;

    // two pressed
    else if(frame.right && !frame.left && frame.up) angle = 315;
    else if(frame.right && frame.left && !frame.up) angle = null;
    else if(!frame.right && frame.left && frame.up) angle = 225;

    // all pressed
    else if(!frame.right && !frame.left && !frame.up) angle = 225;

    return { angle, jump, _jumpKeyPressed: frame.up };
}

export function save(frames: IFrameInfo[]) {
    let saveList: IFrameInfo[] = [];
    for(let frame of frames) {
        let { translation, state, ...save } = frame
        saveList.push(save)
    }
    localStorage.setItem("frames", JSON.stringify(saveList))

    return saveList
}