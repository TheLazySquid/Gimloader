/**
 * @name InfoLines
 * @description Displays a configurable list of info on the screen
 * @author TheLazySquid
 * @version 0.1.1
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/InfoLines/build/InfoLines.js
 * @hasSettings true
 */


// node_modules/gimloader/index.js
var api = new GL();
var gimloader_default = api;

// src/baseLine.ts
var frameCallbacks = [];
var physicsTickCallbacks = [];
gimloader_default.net.onLoad(() => {
  let worldManager = gimloader_default.stores.phaser.scene.worldManager;
  gimloader_default.patcher.after(worldManager, "update", () => {
    for (let callback of frameCallbacks) {
      callback();
    }
  });
  gimloader_default.patcher.after(worldManager.physics, "physicsStep", () => {
    for (let callback of physicsTickCallbacks) {
      callback();
    }
  });
});
var BaseLine = class {
  name;
  enabled;
  enabledDefault;
  settings;
  subscribedCallbacks = [];
  constructor() {
    setTimeout(() => {
      this.enabled = gimloader_default.storage.getValue(this.name, this.enabledDefault);
      this.setupSettings();
      if (this.onFrame) {
        frameCallbacks.push(() => {
          if (!this.enabled) return;
          this.onFrame?.();
        });
      }
      if (this.onPhysicsTick) {
        physicsTickCallbacks.push(() => {
          if (!this.enabled) return;
          this.onPhysicsTick?.();
        });
      }
      gimloader_default.net.onLoad(() => {
        if (this.init) this.init();
      });
    }, 0);
  }
  setupSettings() {
    if (this.settings) {
      for (let id in this.settings) {
        let setting = this.settings[id];
        setting.value = gimloader_default.storage.getValue(id, setting.default);
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
  enable() {
  }
  disable() {
    this.update("");
  }
};

// src/lines/visualCoordinates.ts
var VisualCoordinates = class extends BaseLine {
  enabledDefault = true;
  name = "Visual Coordinates";
  settings = { "visualCoordsDecimalPlaces": {
    label: "Visual coordinates decimal places",
    min: 0,
    max: 10,
    default: 0
  } };
  onFrame() {
    let body = gimloader_default.stores.phaser.mainCharacter.body;
    let decimals = this.settings["visualCoordsDecimalPlaces"].value;
    this.update(`visual x: ${body.x.toFixed(decimals)}, y: ${body.y.toFixed(decimals)}`);
  }
};

// src/Settings.tsx
function Settings2({ infoLines: infoLines2 }) {
  const React = gimloader_default.React;
  let [lines, setLines] = React.useState(infoLines2.lines);
  let [position, setPosition] = React.useState(infoLines2.position);
  return /* @__PURE__ */ gimloader_default.React.createElement("div", { id: "il-settings" }, /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "position" }, "Position", /* @__PURE__ */ gimloader_default.React.createElement("select", { value: position, onChange: (e) => {
    setPosition(e.target.value);
    gimloader_default.storage.setValue("position", e.target.value);
    if (infoLines2.element) infoLines2.element.className = e.target.value;
  } }, /* @__PURE__ */ gimloader_default.React.createElement("option", { value: "top left" }, "Top Left"), /* @__PURE__ */ gimloader_default.React.createElement("option", { value: "top right" }, "Top Right"), /* @__PURE__ */ gimloader_default.React.createElement("option", { value: "bottom left" }, "Bottom Left"), /* @__PURE__ */ gimloader_default.React.createElement("option", { value: "bottom right" }, "Bottom Right"))), /* @__PURE__ */ gimloader_default.React.createElement("hr", null), lines.map((line) => /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("div", null, /* @__PURE__ */ gimloader_default.React.createElement("input", { type: "checkbox", checked: line.enabled, onChange: (e) => {
    line.enabled = e.target.checked;
    gimloader_default.storage.setValue(line.name, line.enabled);
    if (line.enabled) line.enable();
    else line.disable();
    setLines([...lines]);
  } }), line.name), line.settings && Object.entries(line.settings).map(([id, setting]) => /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "setting" }, setting.label, /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "range",
      min: setting.min,
      step: 1,
      max: setting.max,
      value: setting.value,
      onChange: (e) => {
        setting.value = parseInt(e.target.value);
        gimloader_default.storage.setValue(id, setting.value);
        if (line.enabled) line.onSettingsChange?.();
        setLines([...lines]);
      }
    }
  ), setting.value)), /* @__PURE__ */ gimloader_default.React.createElement("hr", null))));
}

// src/styles.scss
var styles_default = `#infoLines {
  position: absolute;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 4px;
  z-index: 99999999;
  border-radius: 5px;
}
#infoLines.top {
  top: 4px;
}
#infoLines.bottom {
  bottom: 4px;
}
#infoLines.left {
  left: 4px;
}
#infoLines.right {
  right: 4px;
}

#il-settings .setting, #il-settings .position {
  display: flex;
  align-items: center;
  gap: 5px;
}
#il-settings .setting input {
  flex-grow: 1;
}`;

// src/lines/velocity.ts
var Velocity = class extends BaseLine {
  enabledDefault = true;
  name = "Velocity";
  settings = { "velocityDecimalPlaces": {
    label: "Velocity decimal places",
    min: 0,
    max: 10,
    default: 2
  } };
  rb;
  init() {
    let physics = gimloader_default.stores.phaser.mainCharacter.physics;
    this.rb = physics.getBody().rigidBody;
  }
  onPhysicsTick() {
    let velocity = this.rb?.linvel();
    if (!velocity) return;
    let decimals = this.settings["velocityDecimalPlaces"].value;
    this.update(`velocity x: ${velocity.x.toFixed(decimals)}, y: ${velocity.y.toFixed(decimals)}`);
  }
};

// src/lines/physicsCoordinates.ts
var PhysicsCoordinates = class extends BaseLine {
  name = "Physics Coordinates";
  enabledDefault = false;
  settings = { "physicsCoordsDecimalPlaces": {
    label: "Physics coordinates decimal places",
    min: 0,
    max: 10,
    default: 2
  } };
  rb;
  init() {
    let physics = gimloader_default.stores.phaser.mainCharacter.physics;
    this.rb = physics.getBody().rigidBody;
  }
  onPhysicsTick() {
    let translation = this.rb?.translation();
    if (!translation) return;
    let decimals = this.settings["physicsCoordsDecimalPlaces"].value;
    this.update(`physics x: ${translation.x.toFixed(decimals)}, y: ${translation.y.toFixed(decimals)}`);
  }
};

// src/lines/fps.ts
var FPS = class extends BaseLine {
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
    if (delta > 1e3) {
      this.lastTime = now;
      let fps = this.frames / (delta / 1e3);
      this.update(`${Math.round(fps)} fps`);
      this.frames = 0;
    }
  }
};

// src/index.ts
gimloader_default.UI.addStyles(styles_default);
var InfoLines = class {
  lines = [
    new VisualCoordinates(),
    new Velocity(),
    new PhysicsCoordinates(),
    new FPS()
  ];
  element;
  position = gimloader_default.storage.getValue("position", "top right");
  constructor() {
    gimloader_default.net.onLoad(() => {
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
      line.subscribe((value) => {
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
};
var infoLines = new InfoLines();
gimloader_default.onStop(() => infoLines.destroy());
gimloader_default.openSettingsMenu(() => {
  gimloader_default.UI.showModal(gimloader_default.React.createElement(Settings2, { infoLines }), {
    title: "InfoLines settings",
    id: "infoLinesSettings",
    buttons: [{ text: "Close", "style": "close" }]
  });
});
export {
  InfoLines
};
