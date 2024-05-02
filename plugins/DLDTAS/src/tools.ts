import { ISharedValues, Keycodes } from "../types"
import { defaultState, generatePhysicsInput } from "./util";
import { updateLasers } from "./updateLasers";

export default class TASTools {
    physicsManager: any;
    nativeStep: Function;
    physics: any;
    rb: any;
    inputManager: any;
    values: ISharedValues;
    updateTable: () => void;
    getPhysicsInput: Function;
    slowdownAmount: number = 1;
    slowdownDelayedFrames: number = 0;

    constructor(physicsManager: any, values: ISharedValues, updateTable: () => void) {
        this.physicsManager = physicsManager;
        this.values = values;
        this.updateTable = updateTable;

        this.nativeStep = physicsManager.physicsStep;
        physicsManager.physicsStep = (dt: number) => {
            // only rerender, rather than running the physics loop
            GL.stores.phaser.mainCharacter.physics.postUpdate(dt);
        }

        this.physics = GL.stores.phaser.mainCharacter.physics;
        this.rb = this.physics.getBody().rigidBody;
        this.inputManager = GL.stores.phaser.scene.inputManager;

        this.getPhysicsInput = this.inputManager.getPhysicsInput;

        this.reset();
    }

    reset() {
        // hardcoded, for now
        this.rb.setTranslation({
            "x": 33.87,
            "y": 638.38
        }, true);

        this.physics.state = JSON.parse(defaultState);
    }

    startPlaying() {
        let { frames } = this.values;
        this.slowdownDelayedFrames = 0;

        this.physicsManager.physicsStep = (dt: number) => {
            this.slowdownDelayedFrames++;

            if(this.slowdownDelayedFrames < this.slowdownAmount) return;

            this.slowdownDelayedFrames = 0;

            updateLasers(this.values.currentFrame);

            // set the inputs
            let frame = frames[this.values.currentFrame]
            if(frame) {
                let translation = this.rb.translation()
                frames[this.values.currentFrame].translation = { x: translation.x, y: translation.y }
                frames[this.values.currentFrame].state = JSON.stringify(this.physics.state);

                let input = generatePhysicsInput(frame, frames[this.values.currentFrame - 1])
                this.inputManager.getPhysicsInput = () => input
            }

            this.setMoveSpeed();

            // step the game
            this.nativeStep(dt);

            // advance the frame
            this.values.currentFrame++;
            this.updateTable();
        }
    }

    stopPlaying() {
        this.physicsManager.physicsStep = (dt: number) => {
            // only rerender, rather than running the physics loop
            GL.stores.phaser.mainCharacter.physics.postUpdate(dt);
        }
    }

    startControlling() {
        this.slowdownDelayedFrames = 0;

        this.inputManager.getPhysicsInput = this.getPhysicsInput;
        this.physicsManager.physicsStep = (dt: number) => {
            // check if we should slow down the game
            this.slowdownDelayedFrames++;
            if(this.slowdownDelayedFrames < this.slowdownAmount) return;
            this.slowdownDelayedFrames = 0;

            let keys: Set<number> = this.inputManager.keyboard.heldKeys;

            // log the inputs and translation/state
            let left = keys.has(Keycodes.LeftArrow) || keys.has(Keycodes.A);
            let right = keys.has(Keycodes.RightArrow) || keys.has(Keycodes.D);
            let up = keys.has(Keycodes.UpArrow) || keys.has(Keycodes.W) || keys.has(Keycodes.Space);

            let translation = this.rb.translation()
            let state = JSON.stringify(this.physics.state);

            this.values.frames[this.values.currentFrame] = { left, right, up, translation, state }

            this.setMoveSpeed();
            this.nativeStep(dt);

            // update the current frame
            this.values.currentFrame++;
            this.updateTable();
        }
    }

    stopControlling() {
        this.physicsManager.physicsStep = (dt: number) => {
            // only rerender, rather than running the physics loop
            GL.stores.phaser.mainCharacter.physics.postUpdate(dt);
        }
    }

    advanceFrame() {
        let frame = this.values.frames[this.values.currentFrame]
        if(!frame) return

        updateLasers(this.values.currentFrame);
        this.setMoveSpeed();

        // log the current translation and state
        let translation = this.rb.translation()
        frame.translation = { x: translation.x, y: translation.y }
        frame.state = JSON.stringify(this.physics.state);

        // generate the input
        let lastFrame = this.values.frames[this.values.currentFrame - 1]
        let input = generatePhysicsInput(frame, lastFrame)

        this.inputManager.getPhysicsInput = () => input

        // step the game
        this.nativeStep(0);
        
        this.values.currentFrame++;
    }

    setSlowdown(amount: number) {
        this.slowdownAmount = amount;
        this.slowdownDelayedFrames = 0;
    }

    // this function should only ever be used when going back in time
    setFrame(number: number) {
        let frame = this.values.frames[number]
        if(!frame || !frame.translation || !frame.state) return

        this.values.currentFrame = number;

        updateLasers(this.values.currentFrame);
        this.rb.setTranslation(frame.translation, true)
        this.physics.state = JSON.parse(frame.state)
    }

    setMoveSpeed() {
        GL.stores.me.movementSpeed = 310;
    }
}