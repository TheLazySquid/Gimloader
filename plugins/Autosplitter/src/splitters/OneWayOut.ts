import { stageCoords } from "../constants";
import SplitsTimer from "../timers/splits";
import { OneWayOutUI } from "../ui/oneWayOut";
import { inBox, onFrame } from "../util";
import { SplitsAutosplitter } from "./autosplitter";

export default class OneWayOutAutosplitter extends SplitsAutosplitter {
    ui = new OneWayOutUI(this);
    timer = new SplitsTimer(this, this.ui);

    stage = 0;

    drops = 0;
    knockouts = 0;

    constructor() {
        super("OneWayOut");
        
        let gameSession = GL.net.colyseus.room.state.session.gameSession;

        GL.net.colyseus.addEventListener("DEVICES_STATES_CHANGES", (msg: any) => {
            for(let change of msg.detail.changes) {
                if(msg.detail.values[change[1][0]] === "GLOBAL_healthPercent") {
                    let device = GL.stores.phaser.scene.worldManager.devices.getDeviceById(change[0]);
                    if(device.propOption.id === "barriers/scifi_barrier_1" && change[2][0] == 0) {
                        this.addAttempt();
                        this.ui.updateAttempts();
                        this.timer.start();
                    }
                }
            }
        });

        GL.net.colyseus.addEventListener("KNOCKOUT", (e: any) => {
            if(e.detail.name !== "Evil Plant") return;
            this.knockouts++;

            let dropped = false;
            // wait 100ms to count the drop
            const addDrop = (e: any) => {
                if(e.detail.devices.addedDevices.devices.length === 0) return;

                dropped = true;
                this.drops++;
                this.updateDrops();
                GL.net.colyseus.removeEventListener("WORLD_CHANGES", addDrop);
            }

            setTimeout(() => {
                GL.net.colyseus.removeEventListener("WORLD_CHANGES", addDrop);
                if(!dropped) this.updateDrops();
            }, 100);

            GL.net.colyseus.addEventListener("WORLD_CHANGES", addDrop)
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

    updateDrops() {
        if(this.knockouts === 0) {
            this.ui.setDropRate("0/0");
        } else {
            let percent = this.drops/this.knockouts*100;
            let percentStr = percent.toFixed(2);
            if(percent === 0) percentStr = "0";
            this.ui.setDropRate(`${this.drops}/${this.knockouts} (${percentStr}%)`)
        }
    }

    getCategoryId() { return "OneWayOut" }

    reset() {
        this.ui?.remove();
        this.ui = new OneWayOutUI(this);
        this.timer = new SplitsTimer(this, this.ui);
        this.stage = 0;
        this.drops = 0;
        this.knockouts = 0;
    }

    destroy() {
        this.ui.remove();
    }
}