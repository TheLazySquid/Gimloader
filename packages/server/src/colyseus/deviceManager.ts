import type { DeviceInfo, MapInfo } from "../types.js";
import { propOptions } from "../consts.js";
import { createValuesArray } from "../utils.js";
import { GameRoom } from "./room.js";
import BaseDevice from "../objects/devices/base.js";
import PropDevice from "../objects/devices/prop.js";

export default class DeviceManager {
    map: MapInfo;
    devices: BaseDevice[];
    room: GameRoom;
    
    constructor(map: MapInfo, room: GameRoom) {
        this.map = map;
        this.room = room;
        this.devices = this.map.devices.map((d) => this.createDevice(d));
    }

    createDevice(info: DeviceInfo) {
        switch(info.deviceId) {
            case "prop":
                return new PropDevice(this.room, info);
            default:
                return new BaseDevice(this.room, info);
        }
    }

    getDevices(type: string) {
        return this.devices.filter((d) => d.deviceId === type);
    }

    getDevice(type: string) {
        return this.devices.find((d) => d.deviceId === type);
    }

    getMapSettings() {
        let mapOptions = this.getDevice("mapOptions");
        return mapOptions.options;
    }

    getInitialMessage() {
        let [values, addValue] = createValuesArray<string>();
        let devices: any[] = [];

        let props: any[] = [];
        let propsSet: Set<string> = new Set();

        // [id, x, y, depth, layer, deviceId, options]
        for(let device of this.devices) {
            if(device.deviceId === "prop" && !propsSet.has(device.options.propId)) {
                let propId = device.options.propId;
                let prop = propOptions.find((p: any) => p.id === propId);

                if(prop.defaultLayer === undefined) prop.defaultLayer = undefined;
                if(prop.minimumRoleLevel === undefined) prop.minimumRoleLevel = undefined;
                if(prop.seasonTicketRequired === undefined) prop.seasonTicketRequired = undefined;

                props.push(prop);
                propsSet.add(propId);
            }

            let options = Object.entries(device.options).map(([key, val]) => [addValue(key), addValue(val)]);

            devices.push([
                device.id, device.x, device.y, device.depth,
                addValue(device.layer), addValue(device.deviceId), options
            ]);
        }

        return {
            devices: {
                addedDevices: {
                    values,
                    devices
                },
                initial: true,
                removedDevices: []
            },
            propsOptions: {
                addedPropsOptions: props,
                initial: true
            }
        }
    }

    getInitialChanges() {
        let [values, addValue] = createValuesArray<string>();
        let changes: [string, number[], any[]][] = [];

        for(let device of this.devices) {
            let keys: number[] = [];
            let values: any[] = []

            // Temporary, props don't have collision without this for some reason
            if(device.deviceId === "prop") {
                keys.push(addValue("GLOBAL_visible"), addValue("GLOBAL_healthPercent"));
                values.push(true, 1);
            }

            changes.push([device.id, keys, values]);
        }

        return {
            changes,
            initial: true,
            removedIds: [],
            values
        }
    }
}