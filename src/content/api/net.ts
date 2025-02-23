import type { Connection } from "$content/core/net/net";
import Net from "$content/core/net/net";
import { validate } from "$content/utils";
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

    /** Sends a message to the server on a specific channel */
    send(channel: string, message: any) {
        if(!validate("net.send", arguments, ['channel', 'string'])) return;
        
        Net.send(channel, message);
    }
}

/**
 * The net api extends [EventEmitter2](https://github.com/EventEmitter2/EventEmitter2)
 * and uses wildcards with ":" as a delimiter.
 * 
 * The following events are emitted:
 * 
 * ```ts
 * // fired when data is recieved on a certain channel
 * net.on(CHANNEL, (data, editFn) => {})
 * 
 * // fired when data is sent on a certain channel
 * net.on(send:CHANNEL, (data, editFn) => {})
 * 
 * // fired when the game loads with a certain type
 * net.on(load:TYPE, (type) => {})
 * 
 * // you can also use wildcards, eg
 * net.on("send:*", () => {})
 * ```
 */
class NetApi extends BaseNetApi {
    constructor() {
        super();

        Net.onAny((channel: string, ...args: any[]) => {
            this.emit(channel, ...args);
        });
    }

    /**
     * Runs a callback when the game is loaded, or runs it immediately if the game has already loaded
     * @returns A function to cancel waiting for load
     */
    onLoad(id: string, callback: (type: Connection["type"]) => void) {
        if(!validate('Net.onLoad', arguments, ['id', 'string'], ['callback', 'function'])) return;

        return Net.pluginOnLoad(id, callback);
    }
    
    /** Cancels any calls to {@link onLoad} with the same id */
    offLoad(id: string) {
        if(!validate('Net.offLoad', arguments, ['id', 'string'])) return;

        Net.pluginOffLoad(id);
    }

    /**
     * @deprecated Methods for both transports are now on the base net api
     * @hidden
     */
    get colyseus() { return this };

    /**
     * @deprecated Methods for both transports are now on the base net api
     * @hidden
     */
    get blueboat() { return this };
    
    /** @hidden */
    private wrappedListeners = new WeakMap<(...args: any[]) => void, (data: any) => void>();

    /**
     * @deprecated use net.on
     * @hidden
     */
    addEventListener(channel: string, callback: (...args: any[]) => void) {
        let listener = this.wrappedListeners.get(callback);
        if(!listener) {
            listener = (data: any) => {
                callback(new CustomEvent(channel, { detail: data }));
            };
        }

        this.on(channel, listener);
    }
    
    /**
     * @deprecated use net.off
     * @hidden
     */
    removeEventListener(channel: string, callback: (...args: any[]) => void) {
        let listener = this.wrappedListeners.get(callback);
        if(!listener) return;

        this.off(channel, listener);
    }
}

/**
 * The net api extends [EventEmitter2](https://github.com/EventEmitter2/EventEmitter2)
 * and uses wildcards with ":" as a delimiter.
 * 
 * The following events are emitted:
 * 
 * ```ts
 * // fired when data is recieved on a certain channel
 * net.on(CHANNEL, (data, editFn) => {})
 * 
 * // fired when data is sent on a certain channel
 * net.on(send:CHANNEL, (data, editFn) => {})
 * 
 * // fired when the game loads with a certain type
 * net.on(load:TYPE, (type) => {})
 * 
 * // you can also use wildcards, eg
 * net.on("send:*", () => {})
 * ```
 */
class ScopedNetApi extends BaseNetApi {
    constructor(private readonly id: string) { super() };
    
    /**
     * Runs a callback when the game is loaded, or runs it immediately if the game has already loaded
     * @returns A function to cancel waiting for load
     */
    onLoad(callback: (type: Connection["type"]) => void) {
        if(!validate('Net.onLoad', arguments, ['callback', 'function'])) return;

        return Net.pluginOnLoad(this.id, callback);
    }
}

Object.freeze(BaseNetApi);
Object.freeze(BaseNetApi.prototype);
Object.freeze(NetApi);
Object.freeze(NetApi.prototype);
Object.freeze(ScopedNetApi);
Object.freeze(ScopedNetApi.prototype);
export { NetApi, ScopedNetApi };