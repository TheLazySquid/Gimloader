import { Client, Room } from "colyseus";

interface RoomOptions {
    code: string;   
}

export class GameRoom extends Room {
    code: string;

    onCreate(options: RoomOptions) {
        this.code = options.code;
    }

    onJoin(client: Client) {
        console.log("CLIENT JOINED!");
    }
}