import type { Gimloader } from "$src/gimloader.svelte";
import { log } from "../util";
import type Net from "./net.svelte";

export class BlueboatIntercept extends EventTarget {
    room: any | null = null;
    blueboatLoaded: boolean = false;

    constructor(loader: Gimloader, net: Net) {
        super();

        let me = this;

        loader.parcel.interceptRequire(null, exports => exports?.default?.toString?.().includes("this.socketListener()"), exports => {
            let nativeRoom = exports.default;
            
            return function() {
                let room = new nativeRoom(...arguments);
                me.room = room;

                net.type = 'Blueboat';

                log('Blueboat room intercepted')

                let nativeCall = room.onMessage.call
                room.onMessage.call = function(channel: string, data: any) {
                    me.dispatchEvent(new CustomEvent(channel, { detail: data }));
                    me.dispatchEvent(new CustomEvent('*', { detail: { channel, data } }));
                    
                    if(!me.blueboatLoaded) {
                        me.blueboatLoaded = true;
                        loader.dispatchEvent(new CustomEvent('loadEnd'))
                        log("Blueboat game finished loading")
                    }

                    return nativeCall.apply(this, arguments);
                }

                return room;
            }
        })
    }

    send(channel: string, message: any) {
        if(!this.room) return;

        this.room.send(channel, message);
    }
}

export class ColyseusIntercept extends EventTarget {
    room: any | null = null;
    colyseusLoaded: boolean = false;

    constructor(loader: Gimloader, net: Net) {
        super();
        let me = this;

        // somewhat taken from https://codeberg.org/gimhook/gimhook/src/commit/3a90857651be40eed84dd19a5bd9f9a5e736adda/modloader/src/game.ts
        loader.parcel.interceptRequire(null, exports => exports?.OnJoinedRoom, exports => {
            let nativeOnJoined = exports.OnJoinedRoom;
            delete exports.OnJoinedRoom;
            
            net.type = 'Colyseus';

            log('Colyseus room intercepted')

            exports.OnJoinedRoom = function(colyseus: any) {
                me.room = colyseus.room;
                
                let nativeSend = colyseus.room.send;
                delete colyseus.room.send;
                colyseus.room.send = function(channel: string, message: any) {
                    me.dispatchEvent(new CustomEvent(`send:${channel}`, { detail: message }));
                    me.dispatchEvent(new CustomEvent('send:*', { detail: { channel, message } }));

                    return nativeSend.apply(this, arguments);
                }

                let nativeDispatchMsg = colyseus.room.dispatchMessage;
                delete colyseus.room.dispatchMessage;

                // intercept colyseus.room.dispatchMessage
                colyseus.room.dispatchMessage = function(channel: string, message: any) {
                    if(!me.colyseusLoaded) {
                        me.colyseusLoaded = true;
                        loader.awaitColyseusLoad();
                        log("Colyseus game finished loading")
                    }

                    me.dispatchEvent(new CustomEvent(channel, { detail: message }));
                    me.dispatchEvent(new CustomEvent('*', { detail: { channel, message } }));
                    
                    nativeDispatchMsg.apply(this, arguments);
                }

                return nativeOnJoined.apply(this, [colyseus]);
            }

            return exports;
        })
    }

    send(channel: string, message: any) {
        if(!this.room) return;

        this.room.send(channel, message);
    }
}