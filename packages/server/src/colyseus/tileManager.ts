import type { Room } from "colyseus";
import type { MapInfo, TileInfo } from "../types.js";

export default class TileManager {
    map: MapInfo;
    tiles: TileInfo[];
    room: Room;
    
    constructor(map: MapInfo, room: Room) {
        this.map = map;
        this.tiles = this.map.tiles;
        this.room = room;
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
}