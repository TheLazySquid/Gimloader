import RAPIER from "@dimforge/rapier2d-compat";
import { physicsScale, tileSize } from "../consts.js";
import { GameRoom } from "./room.js";

export default class PhysicsManager {
    room: GameRoom;
    world = new RAPIER.World({ x: 0, y: 0 });
    stepInterval: Timer;

    constructor(room: GameRoom) {
        this.room = room;
        this.addWorldBounds();
        
        this.stepInterval = setInterval(() => {
            this.step();
        }, 1000 / 12);
    }

    dispose() {
        clearInterval(this.stepInterval);
        this.world.free();
    }

    step() {

    }

    addWorldBounds() {
        const addCollider = (x: number, y: number, width: number, height: number) => {
            let rbDesc = RAPIER.RigidBodyDesc.fixed().setTranslation((x + width / 2) / physicsScale, (y + height / 2) / physicsScale);
            let colliderDesc = RAPIER.ColliderDesc.cuboid(width / 2 / physicsScale, height / 2 / physicsScale);
            let rb = this.world.createRigidBody(rbDesc);
            this.world.createCollider(colliderDesc, rb);
        }

        let x = 0;
        let y = 0; 
        let width = 1000 * tileSize;
        let height = 1000 * tileSize;
        let size = 500;

        addCollider(x, y - size, width, size),
        addCollider(x - size, y, size, height);
        
        let pos = y + height;
        if (this.room.map.mapStyle === "platformer") {
            pos -= 2 * tileSize;
            const chunks = 10;
            const chunkSize = width / chunks;
            for (let i = 0; i < chunks; i++) {
                addCollider(x + i * chunkSize, pos, chunkSize, size)
            }
        } else {
            addCollider(x, pos, width, size);
        }
        addCollider(x + width, y, size, height)
    }
}