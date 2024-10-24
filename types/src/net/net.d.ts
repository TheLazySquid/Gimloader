import type { Gimloader } from "../gimloader";
import { BlueboatIntercept, ColyseusIntercept } from "./clients";
type NetType = 'Blueboat' | 'Colyseus' | 'Unknown';
export default class Net {
    gimloader: Gimloader;
    blueboat: BlueboatIntercept;
    colyseus: ColyseusIntercept;
    type: NetType;
    is1dHost: boolean;
    constructor(loader: Gimloader);
    corsRequest: <TContext = any>(details: Tampermonkey.Request<TContext>) => Promise<Tampermonkey.Response<TContext>>;
    get active(): BlueboatIntercept | ColyseusIntercept;
    get isHost(): any;
    downloadLibraries(needsLibs: string[], confirmName?: string): Promise<void>;
    downloadLibrary(url: string): Promise<void>;
}
export {};
