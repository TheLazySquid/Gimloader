import { IFrameInfo, IRecording } from "../types"
import { stopUpdatingLasers, updateLasers } from "./updateLasers";

export default class Recorder {
    physicsManager: any;
    nativeStep: Function;
    physics: any;
    rb: any;
    inputManager: any;
    getPhysicsInput: Function;

    startPos: { x: number, y: number } = { x: 0, y: 0 };
    startState: string = "";
    frames: IFrameInfo[] = [];

    recording: boolean = false;
    playing: boolean = false;

    constructor(physicsManager: any) {
        this.physicsManager = physicsManager;

        let realNativeStep = physicsManager.physicsStep;
        physicsManager.physicsStep = (dt: number) => {
            GL.stores.me.movementSpeed = 310;
            realNativeStep(dt);
        }
        this.nativeStep = physicsManager.physicsStep;

        // load all bodies in at once for deterministic physics
        for(let id of physicsManager.bodies.staticBodies) {
            physicsManager.bodies.activeBodies.enableBody(id)
        }
        
        // ignore attempts to disable bodies
        physicsManager.bodies.activeBodies.disableBody = () => {};

        this.physics = GL.stores.phaser.mainCharacter.physics;
        this.rb = this.physics.getBody().rigidBody;
        this.inputManager = GL.stores.phaser.scene.inputManager;

        this.getPhysicsInput = this.inputManager.getPhysicsInput;
    }

    toggleRecording() {
        if(this.recording) this.stopRecording();
        else this.startRecording();
    }

    startRecording() {
        this.recording = true;

        this.startPos = this.rb.translation();
        this.startState = JSON.stringify(this.physics.state);
        this.frames = [];

        GL.notification.open({ message: "Started Recording" })

        this.inputManager.getPhysicsInput = this.getPhysicsInput;
        this.physicsManager.physicsStep = (dt: number) => {
            this.frames.push(this.inputManager.getPhysicsInput());

            this.nativeStep(dt);
            updateLasers(this.frames.length);
        }
    }

    stopRecording() {
        this.recording = false;
        this.physicsManager.physicsStep = this.nativeStep;
        stopUpdatingLasers();
        
        let confirm = window.confirm("Do you want to save the recording?");
        if(!confirm) return;
        
        // download the file
        let json: IRecording = {
            startPos: this.startPos,
            startState: this.startState,
            frames: this.frames
        };

        let blob = new Blob([JSON.stringify(json)], { type: "application/json" });
        let url = URL.createObjectURL(blob);

        let name = GL.stores.phaser.mainCharacter.nametag.name;

        let a = document.createElement("a");
        a.href = url;
        a.download = `recording-${name}.json`;
        a.click();
    }

    async playback(data: IRecording) {
        this.playing = true;

        this.rb.setTranslation(data.startPos, true);
        this.physics.state = JSON.parse(data.startState);

        this.physicsManager.physicsStep = (dt: number) => {
            GL.stores.phaser.mainCharacter.physics.postUpdate(dt);
        }

        await new Promise(resolve => setTimeout(resolve, 1500));

        let currentFrame = 0;

        this.physicsManager.physicsStep = (dt: number) => {
            let frame = data.frames[currentFrame];
            if(!frame) {
                this.stopPlayback();
                GL.notification.open({ message: "Playback finished" });
                return;
            }

            this.inputManager.getPhysicsInput = () => frame;

            this.nativeStep(dt);

            currentFrame++;
            updateLasers(currentFrame);
        }
    }

    stopPlayback() {
        this.playing = false;
        stopUpdatingLasers();

        this.physicsManager.physicsStep = this.nativeStep;
        this.inputManager.getPhysicsInput = this.getPhysicsInput;
    }
}