/**
 * @name InfoLines
 * @description Displays a configurable list of info on the screen
 * @author TheLazySquid
 * @version 0.1.0
 */
function onceOrIfLoaded(callback) {
    if (GL.net.type === "Colyseus")
        callback();
    GL.addEventListener("loadEnd", () => {
        if (GL.net.type === "Colyseus")
            callback();
    }, { once: true });
}

let frameCallbacks = [];
let physicsTickCallbacks = [];
onceOrIfLoaded(() => {
    let worldManager = GL.stores.phaser.scene.worldManager;
    // whenever a frame passes
    GL.patcher.after("InfoLines", worldManager, "update", () => {
        for (let callback of frameCallbacks) {
            callback();
        }
    });
    // whenever a physics tick passes
    GL.patcher.after("InfoLines", worldManager.physics, "physicsStep", () => {
        for (let callback of physicsTickCallbacks) {
            callback();
        }
    });
});
class BaseLine {
    name;
    enabled;
    enabledDefault;
    settings;
    subscribedCallbacks = [];
    constructor() {
        // scuffed way to make sure settings are loaded after the constructor has run
        setTimeout(() => {
            this.enabled = GL.storage.getValue("InfoLines", this.name, this.enabledDefault);
            this.setupSettings();
            if (this.onFrame) {
                frameCallbacks.push(() => {
                    if (!this.enabled)
                        return;
                    this.onFrame?.();
                });
            }
            if (this.onPhysicsTick) {
                physicsTickCallbacks.push(() => {
                    if (!this.enabled)
                        return;
                    this.onPhysicsTick?.();
                });
            }
            onceOrIfLoaded(() => {
                if (this.init)
                    this.init();
            });
        }, 0);
    }
    setupSettings() {
        if (this.settings) {
            for (let id in this.settings) {
                let setting = this.settings[id];
                setting.value = GL.storage.getValue("InfoLines", id, setting.default);
            }
        }
    }
    subscribe(callback) {
        this.subscribedCallbacks.push(callback);
    }
    update(value) {
        for (let callback of this.subscribedCallbacks) {
            callback(value);
        }
    }
    enable() { }
    disable() {
        // The line still exists, but it's blank lol
        this.update("");
    }
}

class VisualCoordinates extends BaseLine {
    enabledDefault = true;
    name = "Visual Coordinates";
    settings = { "visualCoordsDecimalPlaces": {
            label: "Visual coordinates decimal places", min: 0, max: 10, default: 0
        } };
    onFrame() {
        let body = GL.stores.phaser.mainCharacter.body;
        let decimals = this.settings["visualCoordsDecimalPlaces"].value;
        this.update(`visual x: ${body.x.toFixed(decimals)}, y: ${body.y.toFixed(decimals)}`);
    }
}

function Settings({ infoLines }) {
    const React = GL.React;
    let [lines, setLines] = React.useState(infoLines.lines);
    let [position, setPosition] = React.useState(infoLines.position);
    return (React.createElement("div", { id: "il-settings" },
        React.createElement("div", { className: "position" },
            "Position",
            React.createElement("select", { value: position, onChange: (e) => {
                    setPosition(e.target.value);
                    GL.storage.setValue("InfoLines", "position", e.target.value);
                    if (infoLines.element)
                        infoLines.element.className = e.target.value;
                } },
                React.createElement("option", { value: "top left" }, "Top Left"),
                React.createElement("option", { value: "top right" }, "Top Right"),
                React.createElement("option", { value: "bottom left" }, "Bottom Left"),
                React.createElement("option", { value: "bottom right" }, "Bottom Right"))),
        React.createElement("hr", null),
        lines.map(line => (React.createElement("div", null,
            React.createElement("div", null,
                React.createElement("input", { type: "checkbox", checked: line.enabled, onChange: (e) => {
                        line.enabled = e.target.checked;
                        GL.storage.setValue("InfoLines", line.name, line.enabled);
                        if (line.enabled)
                            line.enable();
                        else
                            line.disable();
                        // I hate react
                        setLines([...lines]);
                    } }),
                line.name),
            line.settings && Object.entries(line.settings).map(([id, setting]) => (React.createElement("div", { className: "setting" },
                setting.label,
                React.createElement("input", { type: "range", min: setting.min, step: 1, max: setting.max, value: setting.value, onChange: (e) => {
                        setting.value = parseInt(e.target.value);
                        GL.storage.setValue("InfoLines", id, setting.value);
                        if (line.enabled)
                            line.onSettingsChange?.();
                        setLines([...lines]);
                    } }),
                setting.value))),
            React.createElement("hr", null))))));
}

var styles = "#infoLines {\n  position: absolute;\n  background-color: rgba(255, 255, 255, 0.8);\n  padding: 4px;\n  z-index: 99999999;\n  border-radius: 5px;\n}\n#infoLines.top {\n  top: 4px;\n}\n#infoLines.bottom {\n  bottom: 4px;\n}\n#infoLines.left {\n  left: 4px;\n}\n#infoLines.right {\n  right: 4px;\n}\n\n#il-settings .setting, #il-settings .position {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n#il-settings .setting input {\n  flex-grow: 1;\n}";

class Velocity extends BaseLine {
    enabledDefault = true;
    name = "Velocity";
    settings = { "velocityDecimalPlaces": {
            label: "Velocity decimal places", min: 0, max: 10, default: 2
        } };
    rb;
    init() {
        let physics = GL.stores.phaser.mainCharacter.physics;
        this.rb = physics.getBody().rigidBody;
    }
    onPhysicsTick() {
        let velocity = this.rb?.linvel();
        if (!velocity)
            return;
        let decimals = this.settings["velocityDecimalPlaces"].value;
        this.update(`velocity x: ${velocity.x.toFixed(decimals)}, y: ${velocity.y.toFixed(decimals)}`);
    }
}

class PhysicsCoordinates extends BaseLine {
    name = "Physics Coordinates";
    enabledDefault = false;
    settings = { "physicsCoordsDecimalPlaces": {
            label: "Physics coordinates decimal places", min: 0, max: 10, default: 2
        } };
    rb;
    init() {
        let physics = GL.stores.phaser.mainCharacter.physics;
        this.rb = physics.getBody().rigidBody;
    }
    onPhysicsTick() {
        let translation = this.rb?.translation();
        if (!translation)
            return;
        let decimals = this.settings["physicsCoordsDecimalPlaces"].value;
        this.update(`physics x: ${translation.x.toFixed(decimals)}, y: ${translation.y.toFixed(decimals)}`);
    }
}

class FPS extends BaseLine {
    name = "FPS";
    enabledDefault = true;
    lastTime = 0;
    frames = 0;
    constructor() {
        super();
    }
    onFrame() {
        let now = performance.now();
        let delta = now - this.lastTime;
        this.frames++;
        if (delta > 1000) {
            this.lastTime = now;
            let fps = this.frames / (delta / 1000);
            this.update(`${Math.round(fps)} fps`);
            this.frames = 0;
        }
    }
}

/// <reference types='gimloader' />
GL.UI.addStyles("InfoLines", styles);
class InfoLines {
    lines = [
        new VisualCoordinates(),
        new Velocity(),
        new PhysicsCoordinates(),
        new FPS()
    ];
    element;
    position = GL.storage.getValue("InfoLines", "position", "top right");
    constructor() {
        onceOrIfLoaded(() => {
            this.create();
        });
    }
    create() {
        this.element = document.createElement("div");
        this.element.id = "infoLines";
        this.element.className = this.position;
        for (let line of this.lines) {
            let lineElement = document.createElement("div");
            lineElement.classList.add("line");
            this.element.appendChild(lineElement);
            line.subscribe(value => {
                lineElement.innerText = value;
            });
        }
        document.body.appendChild(this.element);
    }
    destroy() {
        for (let line of this.lines) {
            line.disable();
        }
        this.element?.remove();
    }
}
let infoLines = new InfoLines();
function onStop() {
    GL.UI.removeStyles("InfoLines");
    GL.patcher.unpatchAll("InfoLines");
    infoLines.destroy();
}
function openSettingsMenu() {
    GL.UI.showModal(GL.React.createElement(Settings, { infoLines }), {
        title: "InfoLines settings",
        id: "infoLinesSettings",
        buttons: [{ text: "Close", "style": "close" }]
    });
}

export { InfoLines, onStop, openSettingsMenu };
