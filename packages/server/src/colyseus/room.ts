import { Client, Room } from "colyseus";
import Matchmaker, { Game } from "./matchmaker.js";
import { GimkitState } from "./schema.js";
import fs from 'fs';
import DeviceManager from "./deviceManager.js";
import { MapInfo } from "../types.js";
import TileManager from "./tileManager.js";
import { defaultPhysicsState } from "../consts.js";
import Player from "./player.js";

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
    players = new Map<Client, Player>();

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

        this.onMessage("INPUT", (client, input) => {
            let player = this.players.get(client);
            if(!player) return;

            player.onInput(input);
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

        let player = new Player(this, client, options.intentId, name);
        this.players.set(client, player);

        console.log(name, "joined the game!");
    }

    onLeave(client: Client, consented: boolean) {
        const kickPlayer = () => {
            let player = this.players.get(client);
            if(!player) return;

            player.leaveGame();
            this.players.delete(client);
        }

        if(consented) {
            kickPlayer();
        } else {
            this.allowReconnection(client, 30).catch(kickPlayer);
        }
    }
}