import type { Gimloader } from "../index";
type NetType = 'Blueboat' | 'Colyseus' | 'Unknown';
export default class Net {
    blueboat: BlueboatIntercept;
    colyseus: ColyseusIntercept;
    type: NetType;
    get active(): BlueboatIntercept | ColyseusIntercept;
    constructor(loader: Gimloader);
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
