import type { Room as BlueboatRoom } from "blueboat";
import type { Room as ColyseusRoom } from "colyseus.js";
import type Lib from "$core/libManager/lib";
import Parcel from "../parcel";
import EventEmitter from "eventemitter2";
import { confirmLibReload, log } from "$src/utils";
import Patcher from "../patcher";
import LibManager from "$core/libManager/libManager.svelte";
import { settings } from "$src/consts.svelte";

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

    corsRequest = GM.xmlHttpRequest;

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

    downloadLibraries(needsLibs: string[], confirmName?: string) {
        return new Promise<void>(async (res, rej) => {
            let missing = [];
        
            for(let lib of needsLibs) {
                let parts = lib.split('|');
                let libName = parts[0].trim();
                let libUrl = parts[1]?.trim();
        
                if(!LibManager.getLib(libName)) {
                    missing.push({ libName, libUrl });
                }
            }
        
            if(missing.length === 0) return res();
        
            let downloadable = missing.filter(m => m.libUrl);
            
            // wait for user confirmation
            if(confirmName && !settings.autoDownloadMissingLibs) {
                let single = missing.length === 1;
                let msgStart = `The plugin ${confirmName} is missing ${missing.length} ${single ? 'library' : 'libraries'}.`;
                if(downloadable.length === 0) {
                    alert(`${msgStart} You will need to manually download and install ${single ? 'it' : 'them'}.`)
                    return rej();
                }
        
                let conf: boolean = false;
                if(downloadable.length === missing.length) {
                    conf = confirm(`${msgStart} Would you like to download ${single ? 'it' : 'them'}?`);
                } else {
                    conf = confirm(msgStart +
                        ` ${downloadable.length} ${single ? 'is' : 'are'} able to be automatically downloaded. Would you like to do so?` +
                        " The rest will need to be manually downloaded and installed.");
                }
            
                if(!conf) return rej();
            }
        
            let results = await Promise.allSettled(downloadable.map(({ libName, libUrl }) => {
                return new Promise<string>((res, rej) => {
                    this.corsRequest({ url: libUrl })
                        .then((resp) => {
                            if(resp.status !== 200) {
                                rej(`Failed to download library ${libName} from ${libUrl}\nRecieved response status of ${resp.status}`);
                                return;
                            }
                            res(resp.responseText)
                        })
                        .catch(() => rej(`Failed to download library ${libName} from ${libUrl}`));
                })
            }))
        
            let successes = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<string>[];
            let libs = successes.map(s => LibManager.createLib(s.value)).filter(l => l);
            let needsReloads = await Promise.all(libs.map(l => l.enable()));
        
            LibManager.save();

            let reloadNeeders: Lib[] = libs.filter((_, i) => needsReloads[i]);
            if(reloadNeeders.length > 0) {
                let reload = confirmLibReload(reloadNeeders);
                if(reload) location.reload();
            }
        
            let failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
            if(failed.length > 0) {
                let msg = failed.map(f => f.reason).join('\n');
                return rej(msg);
            }
        
            res();
        });
    }

    downloadLibrary(url: string) {
        return new Promise<void>((res, rej) => {
            this.corsRequest({ url })
                .then((resp) => {
                    if(resp.status !== 200) {
                        rej(`Failed to download library from ${url}\nRecieved response status of ${resp.status}`);
                        return;
                    }
                    LibManager.createLib(resp.responseText);
                    res();
                })
                .catch(() => rej(`Failed to download library from ${url}`));
        })
    }
}

const net = new Net();
export default net;