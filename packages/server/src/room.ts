import { Client, Room } from "colyseus";
import Matchmaker, { Game } from "./matchmaker.js";
import GimkitState from "./schema.js";

interface RoomOptions {
    intentId: string;
    authToken: string; // not currently used
}

interface ClientOptions {
    intentId: string;
}

export class GameRoom extends Room<GimkitState> {
    game: Game;

    onCreate(options: RoomOptions) {
        this.setState(new GimkitState());
        this.game = Matchmaker.getByHostIntent(options.intentId);

        if(this.game) {
            this.game.colyseusRoomId = this.roomId;
        } else {
            this.disconnect();
        }
    }

    onJoin(client: Client, options: ClientOptions) {
        // if the intentId is that of the game they are the host
        if(options?.intentId === this.game.intentId) return;

        let intent = this.game.clientIntents.get(options?.intentId);
        if(!intent) {
            client.leave();
            return;
        }

        this.game.clientIntents.delete(options.intentId);
        console.log(intent.name, "joined the game!");
    }
}