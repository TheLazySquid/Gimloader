import { Client, Room } from "colyseus";
import Matchmaker, { Game } from "./matchmaker.js";
import { CharactersItem, GimkitState } from "./schema.js";
import fs from 'fs';
import DeviceManager from "./deviceManager.js";
import { MapInfo } from "../types.js";
import { randomItem } from "../utils.js";
import TileManager from "./tileManager.js";
import { defaultPhysicsState, worldOptions } from "../consts.js";

interface RoomOptions {
    intentId: string;
    authToken: string; // not currently used
}

interface ClientOptions {
    intentId: string;
}

export class GameRoom extends Room<GimkitState> {
    game: Game;
    map: MapInfo = JSON.parse(fs.readFileSync("./maps/test.json").toString());
    devices = new DeviceManager(this.map, this);
    mapSettings = this.devices.getMapSettings();
    terrain = new TileManager(this.map, this);
    updateTimeInterval: Timer;

    onCreate(options: RoomOptions) {
        this.game = Matchmaker.getByHostIntent(options.intentId);

        this.setState(new GimkitState({
            gameCode: this.game.code,
            ownerId: options.intentId,
            map: this.map,
            mapSettings: this.mapSettings
        }));

        if(this.game) {
            this.game.colyseusRoomId = this.roomId;
        } else {
            this.disconnect();
            return;
        }

        this.onMessage("REQUEST_INITIAL_WORLD", (client) => {
            client.send("DEVICES_STATES_CHANGES", this.devices.getInitialChanges());
            client.send("TERRAIN_CHANGES", this.terrain.getInitialMessage());
            client.send("WORLD_CHANGES", this.devices.getInitialMessage());

            let character = this.state.characters.get(client.userData.id);
            client.send("PHYSICS_STATE", {
                packetId: 0,
                x: character.x,
                y: character.y,
                teleport: false,
                physicsState: JSON.stringify(defaultPhysicsState)
            });
        });
        
        this.onMessage("*", () => {});

        this.updateTimeInterval = setInterval(() => {
			this.state.session.gameTime = Date.now();
		}, 500);
    }

    onDispose() {
        clearInterval(this.updateTimeInterval);
    }

    onJoin(client: Client, options: ClientOptions) {
        let name: string;

        // if the intentId is that of the game they are the host
        if(options?.intentId === this.game.intentId) {
            // TODO: Actually get the host's name
            name = "Host";
        } else {
            let intent = this.game.clientIntents.get(options?.intentId);
            if(!intent) {
                client.leave();
                return;
            }
            
            name = intent.name;
            this.game.clientIntents.delete(options.intentId);
        }
        client.userData = { id: options.intentId };

        // determine where to put the client
        let spawnPads = this.devices.getDevices("characterSpawnPad");
        
        let x = 16000, y = 16000;
        if(spawnPads.length > 0) {
            let pad = randomItem(spawnPads);
            x = pad.x;
            y = pad.y;
        }

        let player = new CharactersItem({
            id: options.intentId,
            x, y, name,
            infiniteAmmo: this.mapSettings.infiniteAmmo
        });
        this.state.characters.set(options.intentId, player);

        client.send("AUTH_ID", options.intentId);
        client.send("MY_TEAM", "__NO_TEAM_ID");

        // Unsure what these are for, but the client wants them
        client.send("MEMORY_COSTS_AND_LIMITS", [
            100000, 500, 3, 10, 10, 2, 10, 999999999999,
            2500, 5000, 999999, 999999999999, 75, 6
        ]);

        client.send("INFO_BEFORE_WORLD_SYNC", { x, y });

        // TODO: Only send needed world options
        client.send("WORLD_OPTIONS", worldOptions);

        player.completedInitialPlacement = true;

        console.log(name, "joined the game!");
    }
}