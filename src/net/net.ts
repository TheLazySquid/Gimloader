import type { Gimloader } from "../gimloader";
import { BlueboatIntercept, ColyseusIntercept } from "./clients";

type NetType = 'Blueboat' | 'Colyseus' | 'Unknown';

export default class Net {
    gimloader: Gimloader;
    blueboat: BlueboatIntercept;
    colyseus: ColyseusIntercept;
    type: NetType = 'Unknown';
    is1dHost: boolean = false;

    constructor(loader: Gimloader) {
        this.gimloader = loader;

        this.blueboat = new BlueboatIntercept(loader, this);
        this.colyseus = new ColyseusIntercept(loader, this);

        this.gimloader.parcel.interceptRequire(null,
            exports => exports?.default?.toString?.().includes("hasReceivedHostStaticState"), () => {
                this.is1dHost = true;
        })
    }

    corsRequest = GM.xmlHttpRequest;

    get active() {
        if (this.type == 'Unknown') return null;
        return this.type == 'Blueboat' ? this.blueboat : this.colyseus;
    }

    get isHost() {
        return this.is1dHost || (GL.stores?.session?.amIGameOwner ?? false);
    }

    downloadLibraries(needsLibs: string[], confirmName?: string) {
        return new Promise<void>(async (res, rej) => {
            let missing = [];
        
            for(let lib of needsLibs) {
                let parts = lib.split('|');
                let libName = parts[0].trim();
                let libUrl = parts[1]?.trim();
        
                if(!this.gimloader.lib.getLib(libName)) {
                    missing.push({ libName, libUrl });
                }
            }
        
            if(missing.length === 0) return res();
        
            let downloadable = missing.filter(m => m.libUrl);
            
            // wait for user confirmation
            if(confirmName && !this.gimloader.settings.autoDownloadMissingLibs) {
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
            let libs = successes.map(s => this.gimloader.lib.createLib(s.value)).filter(l => l);
            await Promise.all(libs.map(l => l.enable()));
        
            this.gimloader.lib.save();
            this.gimloader.lib.libs.update();
        
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
                    this.gimloader.lib.createLib(resp.responseText);
                    res();
                })
                .catch(() => rej(`Failed to download library from ${url}`));
        })
    }
}