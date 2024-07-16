import BaseLine, { Settings } from "../baseLine";

export default class Velocity extends BaseLine {
    enabledDefault = true;
    name = "Velocity";
    settings: Settings = {"velocityDecimalPlaces": {
        label: "Velocity decimal places", min: 0, max: 10, default: 2
    }};

    rb: any;

    init() {
        let physics = GL.stores.phaser.mainCharacter.physics;
        this.rb = physics.getBody().rigidBody;
    }

    onPhysicsTick() {
        let velocity = this.rb?.linvel();
        if(!velocity) return;

        let decimals = this.settings["velocityDecimalPlaces"].value;

        this.update(`velocity x: ${velocity.x.toFixed(decimals)}, y: ${velocity.y.toFixed(decimals)}`);
    }
}