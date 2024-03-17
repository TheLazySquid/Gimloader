import type { GimkitLoader } from "../index";
import { log } from "../util";

type NetType = 'Blueboat' | 'Colyseus' | 'Unknown';

export default class Net {
    blueboat: BlueboatIntercept;
    colyseus: ColyseusIntercept;
    type: NetType = 'Unknown';
    
    get active() {
        if (this.type == 'Unknown') return null;
        return this.type == 'Blueboat' ? this.blueboat : this.colyseus;
    }

    constructor(loader: GimkitLoader) {
        this.blueboat = new BlueboatIntercept(loader, this);
        this.colyseus = new ColyseusIntercept(loader, this);
    }
}

export class BlueboatIntercept extends EventTarget {
    room: any | null = null;
    blueboatLoaded: boolean = false;

    constructor(loader: GimkitLoader, net: Net) {
        super();

        let me = this;

        loader.parcel.interceptRequire(exports => exports?.default?.toString?.().includes("this.socketListener()"), exports => {
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

    constructor(loader: GimkitLoader, net: Net) {
        super();
        let me = this;

        // somewhat taken from https://codeberg.org/gimhook/gimhook/src/branch/master/modloader/src/game.ts
        loader.parcel.interceptRequire(exports => exports?.OnJoinedRoom, exports => {
            let nativeOnJoined = exports.OnJoinedRoom;
            delete exports.OnJoinedRoom;
            
            net.type = 'Colyseus';

            log('Colyseus room intercepted')

            exports.OnJoinedRoom = function(colyseus: any) {
                me.room = colyseus.room;

                let nativeDispatchMsg = colyseus.room.dispatchMessage;
                delete colyseus.room.dispatchMessage;

                // intercept colyseus.room.dispatchMessage
                colyseus.room.dispatchMessage = function(channel: string, message: any) {
                    if(!me.colyseusLoaded) {
                        me.colyseusLoaded = true;
                        loader.dispatchEvent(new CustomEvent('loadEnd'))
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