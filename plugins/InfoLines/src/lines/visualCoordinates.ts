import BaseLine, { Settings } from "../baseLine";

export default class VisualCoordinates extends BaseLine {
    enabledDefault = true;
    name = "Visual Coordinates";
    settings: Settings = {"visualCoordsDecimalPlaces": {
        label: "Visual coordinates decimal places", min: 0, max: 10, default: 0
    }};

    onFrame() {
        let body = GL.stores.phaser.mainCharacter.body;
        let decimals = this.settings["visualCoordsDecimalPlaces"].value;
        this.update(`visual x: ${body.x.toFixed(decimals)}, y: ${body.y.toFixed(decimals)}`);
    }
}