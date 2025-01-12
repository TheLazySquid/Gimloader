import EventEmitter from "events";
import type { Room as BlueboatRoom } from "blueboat";
import type { Room as ColyseusRoom } from "colyseus";
interface BlueboatConnection {
    type: "Blueboat";
    room: BlueboatRoom;
}
interface ColyseusConnection {
    type: "Colyseus";
    room: ColyseusRoom;
}
interface NoConnection {
    type: "None";
    room: null;
}
type Connection = BlueboatConnection | ColyseusConnection | NoConnection;
export type NetType = NetApi & Connection;
declare class NetApi extends EventEmitter {
    /** Which type of server the client is currently connected to */
    type: Connection["type"];
    /** The room that the client is connected to, or null if there is no connection */
    room: Connection["room"];
    /** The userscript manager's xmlHttpRequest, which bypasses the CSP */
    corsRequest: <TContext = any>(details: Tampermonkey.Request<TContext>) => Promise<Tampermonkey.Response<TContext>>;
    /** Sends a message to the server on a specific channel */
    send(channel: string, message: any): void;
}
export default NetApi;
