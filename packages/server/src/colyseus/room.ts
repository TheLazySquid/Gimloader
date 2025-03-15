import { Client, Room } from "colyseus";
import Matchmaker, { Game } from "./matchmaker.js";
import { GimkitState } from "./schema.js";
import fs from 'fs';
import DeviceManager from "./deviceManager.js";
import { MapInfo } from "../types.js";
import TileManager from "./tileManager.js";
import { defaultPhysicsState } from "../consts.js";
import Player from "../objects/player.js";
import PhysicsManager from "./physics.js";

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
    physics = new PhysicsManager(this);
    world = this.physics.world;
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

            let player = this.players.get(client);
            player.syncPhysics(true);
        });

        this.onMessage("INPUT", (client, input) => {
            let player = this.players.get(client);
            if(!player) return;

            player.onInput(input);
        });

        this.onMessage("START_GAME", (client) => {
            if(client.userData?.id !== this.game.intentId) return;
            if(this.state.session.phase !== "preGame") return;

            this.state.session.phase = "game";
            this.state.session.gameSession.phase = "game";
            this.showLoading(1200, () => {
                for(let p of this.players.values()) p.moveToSpawnpoint();
            });
        });

        this.onMessage("END_GAME", (client) => {
            if(client.userData?.id !== this.game.intentId) return;
            if(this.state.session.phase !== "game") return;

            this.state.session.gameSession.phase = "results";
        });

        this.onMessage("RESTORE_MAP_EARLIER", (client) => {
            if(client.userData?.id !== this.game.intentId) return;
            if(this.state.session.phase !== "game" || this.state.session.gameSession.phase !== "results") return;

            this.state.session.phase = "preGame";
            this.showLoading(1200, () => {
                for(let p of this.players.values()) p.moveToSpawnpoint();
            });
        });
        
        this.onMessage("*", () => {});

        this.updateTimeInterval = setInterval(() => {
			this.state.session.gameTime = Date.now();
		}, 500);
    }

    onDispose() {
        clearInterval(this.updateTimeInterval);
        this.physics.dispose();
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

    // as far as I can tell the loading screens are purely to mask teleports
    showLoading(duration: number, halfCallback?: () => void) {
        this.state.session.loadingPhase = true;

        if(halfCallback) {
            setTimeout(halfCallback, duration / 2);
        }

        setTimeout(() => {
            this.state.session.loadingPhase = false;
        }, duration);
    }
}