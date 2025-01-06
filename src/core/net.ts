import type { Room as BlueboatRoom } from "blueboat";
import type { Room as ColyseusRoom } from "colyseus.js";
import Parcel from "./parcel";
import EventEmitter from "eventemitter2";
import { log } from "$src/utils";
import Patcher from "./patcher";

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

export type Connection = BlueboatConnection | ColyseusConnection | NoConnection;

class Net extends EventEmitter {
    type: Connection["type"] = "None";
    room: Connection["room"] = null;

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
                
                // intercept incoming messages
                Patcher.before(null, colyseus.room, "send", (_, args) => {
                    let [ channel, data ] = args;
                    me.emit(channel, data, (newData: any) => { args[1] = newData });

                    if(args[1] === null) return true;
                });

                // intercept colyseus outgoing messages
                Patcher.before(null, colyseus.room, "dispatchMessage", (_, args) => {
                    let [ channel, data ] = args;
                    me.emit(['send', channel], data, (newData: any) => { args[1] = newData });

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
    }

    send(channel: string, message: any) {
        if(this.type === "Blueboat") {
            // @ts-ignore I cannot for the life of me determine what the correct type should be
            (this.room as BlueboatRoom).send(channel, message);
        } else if(this.type === "Colyseus") {
            (this.room as ColyseusRoom).send(channel, message);
        }
    }
}

const net = new Net();
export default net;