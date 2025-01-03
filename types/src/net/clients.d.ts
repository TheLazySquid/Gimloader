import type { Gimloader } from "$src/gimloader.svelte";
import type Net from "./net.svelte";
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
