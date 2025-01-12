import type { Connection } from "$core/net/net";
import Net from "$core/net/net";
import { validate } from "$src/utils";
import EventEmitter from "eventemitter2";

class BaseNetApi extends EventEmitter {
    constructor() {
        super({
            wildcard: true,
            delimiter: ':'
        });
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
    
    private wrappedListeners = new WeakMap<(...args: any[]) => void, (data: any) => void>();

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

class NetApi extends BaseNetApi {
    constructor() {
        super();

        Net.onAny((channel: string, ...args: any[]) => {
            this.emit(channel, ...args);
        });
    }

    /** Runs a callback when the game is loaded, or runs it immediately if the game has already loaded */
    onLoad(id: string, callback: (type: Connection["type"]) => void) {
        if(!validate('Net.onLoad', arguments, ['id', 'string'], ['callback', 'function'])) return;

        return Net.pluginOnLoad(id, callback);
    }
    
    /** Cancels any calls to {@link onLoad} with the same id */
    offLoad(id: string) {
        if(!validate('Net.offLoad', arguments, ['id', 'string'])) return;

        Net.pluginOffLoad(id);
    }
}

class ScopedNetApi extends BaseNetApi {
    constructor(private readonly id: string) { super() };
    
    /** Runs a callback when the game is loaded, or runs it immediately if the game has already loaded */
    onLoad(callback: (type: Connection["type"]) => void) {
        if(!validate('Net.onLoad', arguments, ['callback', 'function'])) return;

        return Net.pluginOnLoad(this.id, callback);
    }
}

export type NetType = NetApi & Connection;
export type ScopedNetType = ScopedNetApi & Connection;

Object.freeze(BaseNetApi);
Object.freeze(BaseNetApi.prototype);
Object.freeze(NetApi);
Object.freeze(NetApi.prototype);
Object.freeze(ScopedNetApi);
Object.freeze(ScopedNetApi.prototype);
export { NetApi, ScopedNetApi };