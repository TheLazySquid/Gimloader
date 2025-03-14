import type { MapInfo, TileInfo } from "../types.js";
import { physicsScale, tileSize } from "../consts.js";
import RAPIER from "@dimforge/rapier2d-compat";
import { GameRoom } from "./room.js";

export default class TileManager {
    map: MapInfo;
    tiles: TileInfo[];
    room: GameRoom;
    
    constructor(map: MapInfo, room: GameRoom) {
        this.map = map;
        this.tiles = this.map.tiles;
        this.room = room;

        this.createHitboxes();
    }

    getInitialMessage() {
        let terrains: string[] = [];
        let tiles: number[][] = [];

        // TODO: Compress the tiles before sending via lengthX and lengthY
        for(let tile of this.tiles) {
            let terrainIndex = terrains.indexOf(tile.terrain);
            if(terrainIndex === -1) {
                terrains.push(tile.terrain);
                terrainIndex = terrains.length - 1;
            }

            // [x, y, terrainIndex, collides, depth, lengthX, lengthY]
            tiles.push([tile.x, tile.y, terrainIndex, tile.collides ? 1 : 0, tile.depth, 0, 0]);
        }

        return {
            added: { terrains, tiles },
            initial: true,
            removedTiles: [],
            updateId: 0
        }
    }

    createHitboxes() {
        for(let tile of this.tiles) {
            let x = (tile.x * tileSize + tileSize / 2) / physicsScale;
            let y = (tile.y * tileSize + tileSize / 2) / physicsScale;
            let width = tileSize / 2 / physicsScale;
            let height = tileSize / 2 / physicsScale;

            let rbDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(x, y);
            let colliderDesc = RAPIER.ColliderDesc.cuboid(width, height);
            colliderDesc.setRestitution(0);
            colliderDesc.setFriction(0);
            colliderDesc.setRestitutionCombineRule(RAPIER.CoefficientCombineRule.Min);
            colliderDesc.setFriction(RAPIER.CoefficientCombineRule.Min);

            let rb = this.room.world.createRigidBody(rbDesc);
            let collider = this.room.world.createCollider(colliderDesc, rb);

            tile.rb = rb;
            tile.collider = collider;
        }
    }
}