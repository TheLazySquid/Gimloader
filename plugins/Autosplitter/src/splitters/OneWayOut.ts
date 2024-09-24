import { oneWayOutSplits, stageCoords } from "../constants";
import SplitsTimer from "../timers/splits";
import SplitsUI from "../ui/splits";
import { inBox, onFrame } from "../util";
import { SplitsAutosplitter } from "./autosplitter";

export default class OneWayOutAutosplitter extends SplitsAutosplitter {
    ui = new SplitsUI(this, oneWayOutSplits);
    timer = new SplitsTimer(this, this.ui);

    stage = 0;

    constructor() {
        super("OneWayOut");
        
        let gameSession = GL.net.colyseus.room.state.session.gameSession;

        GL.net.colyseus.addEventListener("DEVICES_STATES_CHANGES", (msg: any) => {
            for(let change of msg.detail.changes) {
                if(msg.detail.values[change[1][0]] === "GLOBAL_healthPercent") {
                    console.log(change)
                    let device = GL.stores.phaser.scene.worldManager.devices.getDeviceById(change[0]);
                    if(device.propOption.id === "barriers/scifi_barrier_1" && change[2][0] == 0) {
                        this.addAttempt();
                        this.ui.updateAttempts();
                        this.timer.start();
                    }
                }
            }
        })

        // start the timer when the game starts
        gameSession.listen("phase", (phase: string) => {
            if(phase === "results") {
                this.reset();
            }
        });

        GL.net.colyseus.addEventListener("send:MESSAGE_FOR_DEVICE", (e: any) => {
            let id = e.detail?.deviceId;
            if(!id) return;
            let device = GL.stores.phaser.scene.worldManager.devices.getDeviceById(id);
            let channel = device?.options?.channel;
            if(!channel) return;

            if(channel === "escaped") {
                setTimeout(() => this.timer.split(), 800);
            }
        })

        // split when we enter a new stage
        onFrame(() => {
            this.timer.update();
            if(stageCoords[this.stage]) {
                let body = GL.stores.phaser.mainCharacter.body;
                if(inBox(body, stageCoords[this.stage])) {
                    this.stage++;
                    this.timer.split();
                }
            }
        });
    }

    getCategoryId() { return "OneWayOut" }

    reset() {
        this.ui?.remove();
        this.ui = new SplitsUI(this, oneWayOutSplits);
        this.timer = new SplitsTimer(this, this.ui);
        this.stage = 0;
    }

    destroy() {
        this.ui.remove();
    }
}