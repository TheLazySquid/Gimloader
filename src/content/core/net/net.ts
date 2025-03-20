import Internal from "$core/internals";
import Parcel from "../parcel";
import EventEmitter from "eventemitter2";
import { log, splicer } from "$content/utils";
import Patcher from "../patcher";
import LibManager from "$core/libManager/libManager.svelte";
import GimkitInternals from "$core/internals";
import { formatDownloadUrl } from "$shared/net";

interface BlueboatConnection {
    type: "Blueboat";
    room: any;
}

interface ColyseusConnection {
    type: "Colyseus";
    room: any;
}

interface NoConnection {
    type: "None";
    room: null;
}

export type Connection = BlueboatConnection | ColyseusConnection | NoConnection;

interface LoadCallback {
    callback: (type: Connection["type"]) => void;
    id: string;
}

export default new class Net extends EventEmitter {
    type: Connection["type"] = "None";
    room: Connection["room"] = null;
    loaded = false;
    is1dHost = false;
    loadCallbacks: LoadCallback[] = [];

    constructor() {
        super({
            wildcard: true,
            delimiter: ':'
        });
    }

    init() {
        let me = this;

        // intercept the colyseus room
        Parcel.getLazy(null, (exports) => exports?.OnJoinedRoom, (exports) => {
            let nativeOnJoined = exports.OnJoinedRoom;
            delete exports.OnJoinedRoom;
            
            log('Colyseus room intercepted');
            
            exports.OnJoinedRoom = function(colyseus: any) {
                me.type = 'Colyseus';
                me.room = colyseus.room;

                me.waitForColyseusLoad();
                
                // intercept outgoing messages
                Patcher.before(null, colyseus.room, "send", (_, args) => {
                    let [ channel, data ] = args;
                    me.emit(['send', channel], data, (newData: any) => { args[1] = newData });

                    if(args[1] === null) return true;
                });

                // intercept incoming messages
                Patcher.before(null, colyseus.room, "dispatchMessage", (_, args) => {
                    let [ channel, data ] = args;
                    me.emit(channel, data, (newData: any) => { args[1] = newData });

                    if(args[1] === null) return true;
                });

                return nativeOnJoined.apply(this, [colyseus]);
            }

            return exports;
        })

        // intercept the room for blueboat
        Parcel.getLazy(null, (e) => e?.default?.toString?.().includes("this.socketListener()"), (exports) => {
            let nativeRoom = exports.default;
            
            exports.default = function() {
                let room = new nativeRoom(...arguments);

                me.room = room;
                me.type = 'Blueboat';

                log('Blueboat room intercepted');
                me.emit('load:blueboat');
                me.onLoad("Blueboat");

                // intercept incoming messages
                Patcher.before(null, room.onMessage, "call", (_, args) => {
                    let [ channel, data ] = args;
                    me.emit(channel, data, (newData: any) => { args[1] = newData });

                    if(args[1] === null) return true;
                });

                // intercept outgoing messages
                Patcher.before(null, room, "send", (_, args) => {
                    let [ channel, data ] = args;
                    me.emit(['send', channel], data, (newData: any) => { args[1] = newData });

                    if(args[1] === null) return true;
                });

                return room;
            }
        });

        Parcel.getLazy(null, exports => exports?.default?.toString?.().includes("hasReceivedHostStaticState"), () => {
            this.is1dHost = true;
        });
    }

    waitForColyseusLoad() {
        const message = Internal.stores.me.nonDismissMessage;
        const loading = Internal.stores.loading;
        const me = Internal.stores.me;
        
        const mobxMsg = message[Object.getOwnPropertySymbols(message)[0]];
        const mobxLoading = loading[Object.getOwnPropertySymbols(loading)[0]];
        const mobxMe = me[Object.getOwnPropertySymbols(me)[0]];

        let title: string = message.title, description: string = message.description,
            initial: boolean = loading.completedInitialLoad,
            terrain: boolean = loading.loadedInitialTerrain,
            devices: boolean = loading.loadedInitialDevices,
            placement: boolean = me.completedInitialPlacement;

        let stopObservers: (() => void)[] = [];
        const check = () => {
            if(title || description || !initial || !terrain || !devices || !placement) return;
            for(let stop of stopObservers) stop();

            this.emit('load:colyseus');
            this.onLoad("Colyseus");
        }

        // observe the values and re-check if they change
        stopObservers.push(
            mobxMsg.values_.get("title").observe_((a: any) => { title = a.newValue; check() }),
            mobxMsg.values_.get("description").observe_((a: any) => { description = a.newValue; check() }),
            mobxLoading.values_.get("completedInitialLoad").observe_((a: any) => { initial = a.newValue; check() }),
            mobxLoading.values_.get("loadedInitialTerrain").observe_((a: any) => { terrain = a.newValue; check() }),
            mobxLoading.values_.get("loadedInitialDevices").observe_((a: any) => { devices = a.newValue; check() }),
            mobxMe.values_.get("completedInitialPlacement").observe_((a: any) => { placement = a.newValue; check() })
        );

        check();
    }

    send(channel: string, message: any) {
        if(this.room.type !== "None") {
            this.room.send(channel, message);
        }
    }

    downloadLibrary(url: string) {
        return new Promise<void>(async (res, rej) => {
            let resp = await fetch(formatDownloadUrl(url))
                .catch(() => rej(`Failed to download library from ${url}`));
            if(!resp) return;
            
            if(resp.status !== 200) {
                rej(`Failed to download library from ${url}\nRecieved response status of ${resp.status}`);
                return;
            }

            let text = await resp.text();
            LibManager.createLib(text);
            res();
        })
    }

    onLoad(type: Connection["type"]) {
        this.loaded = true;

        for(let { callback } of this.loadCallbacks) {
            try {
                callback(type);
            } catch(e) {
                console.error(e);
            }
        }
    }

    pluginOnLoad(id: string, callback: (type: Connection["type"]) => void) {
        if(this.loaded) {
            callback(this.type);
            return () => {};
        }

        let obj = {
            callback,
            id
        };
        
        this.loadCallbacks.push(obj);
        return splicer(this.loadCallbacks, obj);
    }

    pluginOffLoad(id: string) {
        for(let i = 0; i < this.loadCallbacks.length; i++) {
            if(this.loadCallbacks[i].id === id) {
                this.loadCallbacks.splice(i, 1);
                i--;
            }
        }
    }

    get isHost() {
        return this.is1dHost || (GimkitInternals.stores?.session?.amIGameOwner ?? false);
    }
}