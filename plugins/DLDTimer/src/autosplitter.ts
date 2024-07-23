import { resetCoordinates, summitCoords, summitStartCoords } from "./constants";
import Timer from "./timer";
import { fmtMs, inArea } from "./util";

export default class Autosplitter {
    timer = new Timer(this);

    mode: string = GL.storage.getValue("DLD Timer", "mode", "Full Game");
    ilsummit: number = GL.storage.getValue("DLD Timer", "ilsummit", 0);
    ilPreboosts: boolean = GL.storage.getValue("DLD Timer", "ilPreboosts", false);
    category: string = "Current Patch";

    couldStartLastFrame = true;
    hasMoved = false;
    loadedCorrectSummit = false;
    
    autostartILs = GL.storage.getValue("DLD Timer", "autostartILs", false);
    autoRecord = GL.storage.getValue("DLD Timer", "autoRecord", true);
    autoRecording = false;

    setMode(mode: string, ilsummit?: number, ilPreboosts?: boolean) {
        if(this.category === "Current Patch") ilPreboosts = false;

        // set and save values
        this.mode = mode;
        GL.storage.setValue("DLD Timer", "mode", mode);
        if(ilsummit !== undefined) {
            this.ilsummit = ilsummit;
            GL.storage.setValue("DLD Timer", "ilsummit", ilsummit);
        }
        if(ilPreboosts !== undefined) {
            this.ilPreboosts = ilPreboosts;
            GL.storage.setValue("DLD Timer", "ilPreboosts", ilPreboosts);
        }

        this.couldStartLastFrame = true;

        this.timer.loadModeData();
        this.timer.ui.setAttempts(this.timer.attempts);
    }

    init() {
        this.category = "Current Patch";
        if(GL.pluginManager.isEnabled("BringBackBoosts")) {
            if(GL.storage.getValue("BringBackBoosts", "useOriginalPhysics", false)) {
                this.category = "Original Physics";
            } else {
                this.category = "Creative Platforming Patch";
            }
        }

        if(document.readyState === "complete") this.timer.init();
        else document.addEventListener("DOMContentLoaded", () => this.timer.init());

        let worldManager = GL.stores.phaser.scene.worldManager;
        
        GL.patcher.after("DLD Timer", worldManager.physics, "physicsStep", () => {
            let input = GL.stores.phaser.scene.inputManager.getPhysicsInput();

            if(input.jump || input.angle !== null) this.hasMoved = true;
        })

        // whenever a frame passes check if we've reached any summits
        GL.patcher.after("DLD Timer", worldManager, 'update', () => {
            if(this.mode === "Full Game") this.updateFullGame();
            else if(this.ilPreboosts) this.updatePreboosts();
            else this.updateNoPreboosts();

            this.hasMoved = false;
        })

        let savestates = GL.pluginManager.getPlugin("Savestates")?.return;
        if(savestates) {
            savestates.onStateLoaded(this.onStateLoadedBound);
        }
    }

    getRecorder() {
        let inputRecorder = GL.pluginManager.getPlugin("InputRecorder")?.return;
        if(!inputRecorder) return;

        return inputRecorder.getRecorder();
    }

    onStateLoaded(summit: number | string) {
        if(this.autostartILs) {
            if(summit === 1 && this.mode === "Full Game") return;
            this.setMode("Summit", (summit as number) - 1);
            this.reset();

            if(!this.ilPreboosts) this.loadedCorrectSummit = true;
            return;
        }

        if(this.mode === "Full Game") return;
        if(this.ilPreboosts) return;

        if(this.ilState !== "waiting") {
            this.reset();
        }

        this.loadedCorrectSummit = summit === this.ilsummit + 1;
    }

    onStateLoadedBound = this.onStateLoaded.bind(this);

    reset() {
        // kind of cheaty way to reset the UI
        this.timer.ui.remove();
        this.timer = new Timer(this);
        this.timer.init();
        this.summit = 0;
        this.ilState = "waiting";
        this.couldStartLastFrame = true;
        this.loadedCorrectSummit = false;

        let recorder = this.getRecorder();
        if(recorder && recorder.recording && this.autoRecording) {
            recorder.stopRecording(false);
        }
    }

    ilState = "waiting";

    updatePreboosts() {
        let body = GL.stores.phaser.mainCharacter.body;
        let coords = summitCoords[this.ilsummit];
        
        if(this.ilState === "waiting") {
            if(inArea(body, coords)) {
                if(this.couldStartLastFrame) return;
                this.ilState = "started";
                this.timer.start(this.ilsummit);
                this.onRunStart();

                this.timer.onUpdate();
            } else {
                this.couldStartLastFrame = false;
            }
        } else if(this.ilState === "started") {
            // check if we've reached the end
            if(inArea(body, summitStartCoords[this.ilsummit + 1])) {
                let isPb = this.timer.finishIl();
                this.ilState = "completed";
                this.couldStartLastFrame = true;
                this.onRunEnd(isPb);
            } else {
                this.timer.onUpdate();
            }
        }
    }

    updateNoPreboosts() {
        if(!this.loadedCorrectSummit) return;
        let body = GL.stores.phaser.mainCharacter.body;

        if(this.ilState === "waiting") {
            if(this.hasMoved) {
                this.ilState = "started";
                this.timer.start(this.ilsummit);
                this.onRunStart();
                this.timer.onUpdate();
            }
        } else if(this.ilState === "started") {
            if(inArea(body, summitStartCoords[this.ilsummit + 1])) {
                let isPb = this.timer.finishIl();
                this.ilState = "completed";
                this.onRunEnd(isPb);
            } else {
                this.timer.onUpdate();
            }
        }
    }

    summit = 0;

    updateFullGame() {
        let body = GL.stores.phaser.mainCharacter.body;

        // check if we're at a position where we should reset
        if(this.summit > 0 && body.x < resetCoordinates.x && body.y > resetCoordinates.y) {
            this.reset();
            return;
        }

        if(this.summit > summitStartCoords.length - 1) return;
        if(this.summit === 0) {
            if(body.x > summitStartCoords[0].x && body.y < summitStartCoords[0].y + 10) {
                if(this.couldStartLastFrame) return;
                this.summit = 1;
                this.timer.start();
                this.onRunStart();
            } else {
                this.couldStartLastFrame = false;
            }
        } else if(inArea(body, summitStartCoords[this.summit])) {
            this.summit++;
            let isPb = this.timer.split();

            // Check if the run is finished
            if(this.summit > summitStartCoords.length - 1) {
                this.onRunEnd(isPb);
            }
        }

        this.timer.onUpdate();
    }

    onRunStart() {
        if(!this.autoRecord) return;
        let recorder = this.getRecorder();
        if(!recorder) return;

        // Don't auto-record during a manual recording or playback
        if(recorder.recording || recorder.playing) return;

        recorder.startRecording();
        this.autoRecording = true;
    }

    onRunEnd(isPb: boolean = false) {
        if(!this.autoRecord) return;
        let recorder = this.getRecorder();
        if(!recorder) return;

        // Don't stop unless we're recording
        if(!recorder.recording || recorder.playing || !this.autoRecording) return;
        this.autoRecording = false;

        if(!isPb) return;
        let username = GL.stores.phaser.mainCharacter.nametag.name;
        let mode = "Full Game";
        if(this.mode !== "Full Game") {
            mode = `Summit ${this.ilsummit + 1}`;
            if(this.ilPreboosts) mode += " (Preboosts)";
        }

        let time = fmtMs(this.timer.now - this.timer.startTime);

        recorder.stopRecording(isPb, `recording-${username}-${this.category}-${mode}-${time}.json`);

        GL.notification.open({ message: `Auto-saved PB of ${time}`, placement: "topLeft" });
    }

    destroy() {
        this.timer.ui.remove();

        let savestates = GL.pluginManager.getPlugin("Savestates")?.return;
        if(savestates) {
            savestates.offStateLoaded(this.onStateLoadedBound);
        }
    }
}