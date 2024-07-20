import { resetCoordinates, summitCoords, summitStartCoords } from "./constants";
import Timer from "./timer";
import { inArea } from "./util";

export default class Autosplitter {
    timer = new Timer(this);

    mode = GL.storage.getValue("DLD Timer", "mode", "Full Game");
    ilsummit = GL.storage.getValue("DLD Timer", "ilsummit", 0);
    ilPreboosts = GL.storage.getValue("DLD Timer", "ilPreboosts", false);
    category: string = "Current Patch";

    couldStartLastFrame = true;
    hasMoved = false;
    loadedCorrectSummit = false;

    setMode(mode: string, ilsummit?: number, ilPreboosts?: boolean) {
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

    onStateLoaded(summit: number | string) {
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

                this.timer.onUpdate();
            } else {
                this.couldStartLastFrame = false;
            }
        } else if(this.ilState === "started") {
            // check if we've reached the end
            if(inArea(body, summitStartCoords[this.ilsummit + 1])) {
                this.timer.finishIl();
                this.ilState = "completed";
                this.couldStartLastFrame = true;
            }

            this.timer.onUpdate();
        }
    }

    updateNoPreboosts() {
        if(!this.loadedCorrectSummit) return;
        let body = GL.stores.phaser.mainCharacter.body;

        if(this.ilState === "waiting") {
            if(this.hasMoved) {
                this.ilState = "started";
                this.timer.start(this.ilsummit);
                this.timer.onUpdate();
            }
        } else if(this.ilState === "started") {
            if(inArea(body, summitStartCoords[this.ilsummit + 1])) {
                this.timer.finishIl();
                this.ilState = "completed";
            }

            this.timer.onUpdate();
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
            } else {
                this.couldStartLastFrame = false;
            }
        } else if(inArea(body, summitStartCoords[this.summit])) {
            this.summit++;
            this.timer.split();
        }

        this.timer.onUpdate();
    }

    destroy() {
        this.timer.ui.remove();

        let savestates = GL.pluginManager.getPlugin("Savestates")?.return;
        if(savestates) {
            savestates.offStateLoaded(this.onStateLoadedBound);
        }
    }
}