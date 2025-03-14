import type { Client } from "colyseus";
import type { GameRoom } from "../colyseus/room.js";
import { CollisionGroups, createCollisionGroup, degToRad, randomItem } from "../utils.js";
import { CharactersItem } from "../colyseus/schema.js";
import { physicsConsts, physicsScale, worldOptions } from "../consts.js";
import RAPIER from "@dimforge/rapier2d-compat";
import { PhysicsObjects } from "../types.js";

export default class Player {
    room: GameRoom;
    client: Client;
    id: string;
    name: string;
    player: CharactersItem;
    physicsObjects: PhysicsObjects;
    
    constructor(room: GameRoom, client: Client, id: string, name: string) {
        this.room = room;
        this.client = client;
        this.id = id;
        this.name = name;

        this.init();
    }

    init() {
        // determine where to put the client
        let spawnPads = this.room.devices.getDevices("characterSpawnPad");
        
        let x = 16000, y = 16000;
        if(spawnPads.length > 0) {
            let pad = randomItem(spawnPads);
            x = pad.x;
            y = pad.y;
        }

        this.player = new CharactersItem({
            id: this.id,
            x, y,
            name: this.name,
            infiniteAmmo: this.room.mapSettings.infiniteAmmo
        });
        this.room.state.characters.set(this.id, this.player);

        // send initial packets
        this.client.send("AUTH_ID", this.id);
        this.client.send("MY_TEAM", "__NO_TEAM_ID");

        // Unsure what these are for, but the client wants them
        this.client.send("MEMORY_COSTS_AND_LIMITS", [
            100000, 500, 3, 10, 10, 2, 10, 999999999999,
            2500, 5000, 999999, 999999999999, 75, 6
        ]);

        this.client.send("INFO_BEFORE_WORLD_SYNC", { x, y });

        // TODO: Only send needed world options
        this.client.send("WORLD_OPTIONS", worldOptions);

        let capsuleSize = this.room.map.mapStyle === "platformer" ? physicsConsts.capsule.platformer : physicsConsts.capsule.topDown;

        // create the player's rigidbody
        let rbDesc = RAPIER.RigidBodyDesc.kinematicPositionBased().setTranslation(x / physicsScale, y / physicsScale);
        let rb = this.room.world.createRigidBody(rbDesc);
        let colliderDesc = RAPIER.ColliderDesc.capsule(capsuleSize.height, capsuleSize.radius);
        colliderDesc.setCollisionGroups(createCollisionGroup({
            belongs: [CollisionGroups.characterMainBody],
            collidesWith: [CollisionGroups.staticWorldCollider, CollisionGroups.inactiveStaticWorldCollider]
        }));
        let collider = this.room.world.createCollider(colliderDesc, rb);
        let controller = this.room.world.createCharacterController(physicsConsts.controllerOffset);
        controller.setMaxSlopeClimbAngle(degToRad(999999999));
        controller.setMinSlopeSlideAngle(degToRad(999999999));

        if(this.room.map.mapStyle === "platformer") {
            controller.setUp(new RAPIER.Vector2(0, -1));
            controller.setMaxSlopeClimbAngle(degToRad(physicsConsts.climbAngle));
            controller.setMinSlopeSlideAngle(degToRad(physicsConsts.slideAngle));
            controller.enableAutostep(physicsConsts.autoStep.maxHeight, physicsConsts.autoStep.minWidth, true);
            controller.enableSnapToGround(physicsConsts.groundSnapHeight);
        }

        controller.setCharacterMass(500);

        rb.setRotation(degToRad(capsuleSize.angle), true);
        this.physicsObjects = { controller, rb, collider };

        this.player.completedInitialPlacement = true;
    }

    leaveGame() {
        this.room.state.characters.delete(this.id);        
    }

    onInput(message: number[]) {
        let [packetId, jumped, angle, x, y, moveSpeed, teleportCount, lastTerrainUpdate] = message;

        this.physicsObjects.rb.setTranslation({ x, y }, true);

        // TODO: Actually validate movement
        this.physicsObjects.controller.computeColliderMovement(this.physicsObjects.collider, { x: 0, y: 0.01 });
        this.room.world.step();

        let grounded = this.physicsObjects.controller.computedGrounded();

        this.player.physics.isGrounded = grounded;
        this.player.x = x * physicsScale;
        this.player.y = y * physicsScale;
    }
}