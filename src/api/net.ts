import type { Connection } from "$core/net/net";
import Net from "$core/net/net";
import { validate } from "$src/utils";
import EventEmitter from "eventemitter2";

export type NetType = NetApi & Connection;

class NetApi extends EventEmitter {
    constructor() {
        super({
            wildcard: true,
            delimiter: ':'
        });

        Net.onAny((channel, ...args) => {
            console.log("Emitting on", channel);
            this.emit(channel, ...args);
        });
    }

    /** Which type of server the client is currently connected to */
    get type(): Connection["type"] { return Net.type };

    /** The room that the client is connected to, or null if there is no connection */
    get room(): Connection["room"] { return Net.room };

    /** The userscript manager's xmlHttpRequest, which bypasses the CSP */
    corsRequest = Net.corsRequest;

    /** Sends a message to the server on a specific channel */
    send(channel: string, message: any) {
        if(!validate("net.send", arguments, ['channel', 'string'])) return;
        
        Net.send(channel, message);
    }
}

Object.freeze(NetApi);
Object.freeze(NetApi.prototype);
export default NetApi;