import { onceOrIfLoaded } from "./util";

let frameCallbacks: (() => void)[] = [];
let physicsTickCallbacks: (() => void)[] = [];

onceOrIfLoaded(() => {
    let worldManager = GL.stores.phaser.scene.worldManager

    // whenever a frame passes
    GL.patcher.after("InfoLines", worldManager, "update", () => {
        for(let callback of frameCallbacks) {
            callback();
        }
    })

    // whenever a physics tick passes
    GL.patcher.after("InfoLines", worldManager.physics, "physicsStep", () => {
        for(let callback of physicsTickCallbacks) {
            callback();
        }
    })
})

export interface Setting {
    label: string
    min: number
    max: number
    default: number
    value?: number
}

export type Settings = Record<string, Setting>;

console.log

export default abstract class BaseLine {
    name: string;
    enabled: boolean;
    enabledDefault: boolean;
    settings?: Settings;

    subscribedCallbacks: ((value: string) => void)[] = [];

    constructor() {
        // scuffed way to make sure settings are loaded after the constructor has run
        setTimeout(() => {
            this.enabled = GL.storage.getValue("InfoLines", this.name, this.enabledDefault);
            this.setupSettings()

            if(this.onFrame) {
                frameCallbacks.push(() => {
                    if(!this.enabled) return;
                    this.onFrame?.();
                });
            }
    
            if(this.onPhysicsTick) {
                physicsTickCallbacks.push(() => {
                    if(!this.enabled) return;
                    this.onPhysicsTick?.();
                });
            }
    
            onceOrIfLoaded(() => {
                if(this.init) this.init();
            });
        }, 0);
    }

    setupSettings() {
        if(this.settings) {
            for(let id in this.settings) {
                let setting = this.settings[id];
                setting.value = GL.storage.getValue("InfoLines", id, setting.default);
            }
        }
    }
    
    subscribe(callback: (value: string) => void) {
        this.subscribedCallbacks.push(callback);
    }

    update(value: string) {
        for(let callback of this.subscribedCallbacks) {
            callback(value);
        }
    }

    enable() {}

    disable() {
        // The line still exists, but it's blank lol
        this.update("");
    }

    init?(): void;
    onSettingsChange?(): void;
    onFrame?(): void;
    onPhysicsTick?(): void;
}