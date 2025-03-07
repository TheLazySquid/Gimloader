import { Client, Room } from "colyseus";
import Matchmaker from "./matchmaker.js";

interface RoomOptions {
    intentId: string;
    authToken: string; // not currently used
}

export class GameRoom extends Room {
    onCreate(options: RoomOptions) {
        let game = Matchmaker.getByHostIntent(options.intentId);

        if(game) {
            game.colyseusRoomId = this.roomId;
        } else {
            this.disconnect();
        }
    }

    onJoin(client: Client) {
        console.log("CLIENT JOINED!");
    }
}