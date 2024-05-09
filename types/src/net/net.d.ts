import type { Gimloader } from "../gimloader";
type NetType = 'Blueboat' | 'Colyseus' | 'Unknown';
export default class Net {
    loader: Gimloader;
    blueboat: BlueboatIntercept;
    colyseus: ColyseusIntercept;
    type: NetType;
    is1dHost: boolean;
    constructor(loader: Gimloader);
    get active(): BlueboatIntercept | ColyseusIntercept;
    get isHost(): any;
}
export declare class BlueboatIntercept extends EventTarget {
    room: any | null;
    blueboatLoaded: boolean;
    constructor(loader: Gimloader, net: Net);
    send(channel: string, message: any): void;
}
export declare class ColyseusIntercept extends EventTarget {
    room: any | null;
    colyseusLoaded: boolean;
    constructor(loader: Gimloader, net: Net);
    send(channel: string, message: any): void;
}
export {};
