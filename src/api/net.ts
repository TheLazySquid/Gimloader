import type { Connection } from "$core/net/net";
import Net from "$core/net/net";
import { validate } from "$src/utils";
import EventEmitter from "eventemitter2";

export type NetType = NetApi & Connection;

class NetApi extends EventEmitter {
    constructor(listen = true) {
        super({
            wildcard: true,
            delimiter: ':'
        });

        if(listen) {
            Net.onAny((channel: string, ...args: any[]) => {
                this.emit(channel, ...args);
            });
        }
    }

    /** Which type of server the client is currently connected to */
    get type(): Connection["type"] { return Net.type };

    /** The room that the client is connected to, or null if there is no connection */
    get room(): Connection["room"] { return Net.room };

    /** Whether the user is the one hosting the current game */
    get isHost() { return Net.isHost };

    /** The userscript manager's xmlHttpRequest, which bypasses the CSP */
    corsRequest = Net.corsRequest;

    /** Sends a message to the server on a specific channel */
    send(channel: string, message: any) {
        if(!validate("net.send", arguments, ['channel', 'string'])) return;
        
        Net.send(channel, message);
    }
    
    /** @deprecated Methods for both transports are now on the base net api */
    get colyseus() { return this };
    
    /** @deprecated Methods for both transports are now on the base net api */
    get blueboat() { return this };
    
    private wrappedListeners = new Map<(...args: any[]) => void, (data: any) => void>();

    /** @deprecated use net.on */
    addEventListener(channel: string, callback: (...args: any[]) => void) {
        let listener = this.wrappedListeners.get(callback);
        if(!listener) {
            listener = (data: any) => {
                callback(new CustomEvent(channel, { detail: data }));
            };
        }

        this.on(channel, listener);
    }
    
    /** @deprecated use net.off */
    removeEventListener(channel: string, callback: (...args: any[]) => void) {
        let listener = this.wrappedListeners.get(callback);
        if(!listener) return;

        this.off(channel, listener);
    }
}

Object.freeze(NetApi);
Object.freeze(NetApi.prototype);
export default NetApi;