import { GameRoom } from "../../colyseus/room.js";
import { propOptions } from "../../consts.js";
import { DeviceInfo } from "../../types.js";
import { degToRad } from "../../utils.js";
import BaseDevice from "./base.js";

export default class PropDevice extends BaseDevice {
    constructor(room: GameRoom, info: DeviceInfo) {
        super(room, info);

        if(info.options.UseColliders) {
            this.createColliders();
        }
    }

    getPosAfterTransform(x: number, y: number, scale: number, angle: number) {
        const scaledX = x * scale;
        const scaledY = y * scale;
        const angleRad = degToRad(angle);

        return {
            x: scaledX * Math.cos(angleRad) - scaledY * Math.sin(angleRad),
            y: scaledX * Math.sin(angleRad) + scaledY * Math.cos(angleRad)
        }
    }

    createColliders() {
        let prop = propOptions.find((p: any) => p.id === this.options.propId);
        if(!prop) return;
        const scale = this.options.Scale;

        for(let collider of prop.rectColliders) {
            let x = this.options.FlipX ? -collider.x : collider.x;
            let angle = this.options.FlipX ? -collider.angle : collider.angle;
            let pos = this.getPosAfterTransform(x, collider.y, scale, this.options.Angle);

            this.createCollider({
                x: pos.x,
                y: pos.y,
                width: collider.w * scale,
                height: collider.h * scale,
                angle: this.options.Angle + angle,
                type: "box"
            });
        }
        for(let collider of prop.circleColliders) {
            let x = this.options.FlipX ? -collider.x : collider.x;
            let pos = this.getPosAfterTransform(x, collider.y, scale, this.options.Angle);

            this.createCollider({
                x: pos.x,
                y: pos.y,
                r: collider.r * scale,
                type: "circle"
            });
        }
        for(let collider of prop.ellipseColliders) {
            let x = this.options.FlipX ? -collider.x : collider.x;
            let angle = this.options.FlipX ? -collider.angle : collider.angle;
            let pos = this.getPosAfterTransform(x, collider.y, scale, this.options.Angle);
            
            let max = Math.max(collider.r1, collider.r2);
            let min = Math.min(collider.r1, collider.r2);
            let height = max - min;
            let offset = max === collider.r1 ? 90 : 0;

            this.createCollider({
                x: pos.x,
                y: pos.y,
                r: min,
                height,
                angle: this.options.Angle + angle + offset,
                type: "capsule"
            });
        }
    }
}