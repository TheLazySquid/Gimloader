import type { Connection } from "$src/core/net";
import Net from "$src/core/net";
import EventEmitter from "events";

export type NetType = NetApi & Connection;

class NetApi extends EventEmitter {
    /** Which type of server the client is currently connected to */
    get type(): Connection["type"] { return Net.type };

    /** The room that the client is connected to, or null if there is no connection */
    get room(): Connection["room"] { return Net.room };

    /** The userscript manager's xmlHttpRequest, which bypasses the CSP */
    corsRequest = GM.xmlHttpRequest;

    /** Sends a message to the server on a specific channel */
    send(channel: string, message: any) {
        Net.send(channel, message);
    }
}

Object.freeze(NetApi);
Object.freeze(NetApi.prototype);
export default NetApi;