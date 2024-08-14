import { boatChannels, fishtopiaSplits } from "../constants";
import SplitsUI from "../ui/splits";
import { SplitsAutosplitter } from "./autosplitter";
import SplitsTimer from '../timers/splits';
import { onFrame } from "../util";

export default class FishtopiaAutosplitter extends SplitsAutosplitter {
    ui = new SplitsUI(this, fishtopiaSplits);
    timer = new SplitsTimer(this, this.ui);

    usedChannels = new Set<string>();

    constructor() {
        super("Fishtopia");

        let gameSession = GL.net.colyseus.room.state.session.gameSession;

        GL.net.colyseus.room.state.session.listen("loadingPhase", (val: boolean) => {
            if(val) return;

            if(gameSession.phase === "game") {
                this.addAttempt();
                this.ui.updateAttempts();
                this.timer.start();
            }
        });

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
            if(!boatChannels.includes(channel)) return;

            // split when we use a new boat
            if(this.usedChannels.has(channel)) return;
            this.usedChannels.add(channel);

            const onMoved = (e: any) => {
                if(e.detail.teleport) {
                    this.timer.split();
                    GL.net.colyseus.removeEventListener("PHYSICS_STATE", onMoved);
                }
            }

            GL.net.colyseus.addEventListener("PHYSICS_STATE", onMoved);
        });

        let id = GL.stores.phaser.mainCharacter.id;
        GL.net.colyseus.room.state.characters.get(id).inventory.slots.onChange((_: any, key: string) => {
            if(key === "gim-fish") {
                this.timer.split();
                this.timer.stop();
            }
        })

        onFrame(() => {
            this.timer.update();
        })
    }

    getCategoryId() { return "fishtopia" }

    reset() {
        this.ui?.remove();
        this.ui = new SplitsUI(this, fishtopiaSplits);
        this.timer = new SplitsTimer(this, this.ui);
        this.usedChannels.clear();
    }

    destroy() {
        this.ui.remove();
    }
}