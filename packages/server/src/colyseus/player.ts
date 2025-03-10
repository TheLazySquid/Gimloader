import type { Client } from "colyseus";
import type { GameRoom } from "./room.js";
import { randomItem } from "../utils.js";
import { CharactersItem } from "./schema.js";
import { worldOptions } from "../consts.js";

export default class Player {
    room: GameRoom;
    client: Client;
    id: string;
    name: string;
    player: CharactersItem;
    
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

        this.player.completedInitialPlacement = true;
    }

    leaveGame() {
        this.room.state.characters.delete(this.id);        
    }

    onInput(message: number[]) {
        let [packetId, jumped, angle, x, y, moveSpeed, teleportCount, lastTerrainUpdate] = message;

        this.player.x = x * 100;
        this.player.y = y * 100;
    }
}