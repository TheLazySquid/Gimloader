/**
 * @name AutoKicker
 * @description Automatically kicks players from your lobby with a customizable set of rules
 * @author TheLazySquid
 * @version 0.2.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/AutoKicker/build/AutoKicker.js
 */


// node_modules/gimloader/index.js
var api = new GL();
var gimloader_default = api;

// src/styles.scss
var styles_default = `#AutoKick-UI {
  position: absolute;
  top: 20px;
  left: 20px;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
  border-radius: 5px;
}
#AutoKick-UI .root {
  display: flex;
  flex-direction: column;
  color: white;
  padding: 10px;
}
#AutoKick-UI .checkboxes {
  display: flex;
  align-items: center;
  justify-content: space-around;
  gap: 5px;
}
#AutoKick-UI .idleDelaySlider {
  display: flex;
  align-items: center;
  gap: 5px;
}
#AutoKick-UI .idleDelaySlider input {
  flex-grow: 1;
}
#AutoKick-UI .idleDelaySlider label {
  font-size: 12px;
}
#AutoKick-UI h2 {
  width: 100%;
  text-align: center;
  margin-bottom: 5px;
}
#AutoKick-UI .blacklist {
  display: flex;
  flex-direction: column;
  gap: 5px;
  max-height: 500px;
  overflow-y: auto;
}
#AutoKick-UI .blacklist .rule {
  display: flex;
  align-items: center;
  border-radius: 8px;
  border: 1px solid white;
  background-color: rgba(0, 0, 0, 0.5);
}
#AutoKick-UI .blacklist .rule .name {
  flex-grow: 1;
}
#AutoKick-UI .blacklist .rule .exact {
  padding: 3px;
  transition: transform 0.2s;
  background-color: rgba(0, 0, 0, 0.5);
  text-decoration: underline;
  border: none;
}
#AutoKick-UI .blacklist .rule .exact:hover {
  transform: scale(1.05);
}
#AutoKick-UI .blacklist .rule .delete {
  font-size: 20px;
  border: none;
  background-color: transparent;
  transition: transform 0.2s;
}
#AutoKick-UI .blacklist .rule .delete:hover {
  transform: scale(1.05);
}
#AutoKick-UI .blacklist .add {
  font-size: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  border: 1px solid white;
  background-color: rgba(0, 0, 0, 0.5);
}`;

// src/autokicker.ts
var AutoKicker = class {
  myId;
  lastLeaderboard;
  kickDuplicateNames = false;
  kickSkinless = false;
  kickIdle = false;
  blacklist = [];
  idleDelay = 2e4;
  el;
  UIVisible = true;
  idleKickTimeouts = /* @__PURE__ */ new Map();
  unOnAdd;
  kicked = /* @__PURE__ */ new Set();
  constructor() {
    this.loadSettings();
    gimloader_default.onStop(() => this.dispose());
  }
  loadSettings() {
    let settings = gimloader_default.storage.getValue("Settings", {});
    this.kickDuplicateNames = settings.kickDuplicateNames ?? false;
    this.kickSkinless = settings.kickSkinless ?? false;
    this.blacklist = settings.blacklist ?? [];
    this.kickIdle = settings.kickIdle ?? false;
    this.idleDelay = settings.idleDelay ?? 2e4;
  }
  saveSettings() {
    gimloader_default.storage.setValue("Settings", {
      kickDuplicateNames: this.kickDuplicateNames,
      kickSkinless: this.kickSkinless,
      blacklist: this.blacklist,
      kickIdle: this.kickIdle,
      idleDelay: this.idleDelay
    });
  }
  start() {
    if (gimloader_default.net.type === "Colyseus") {
      this.myId = gimloader_default.stores.phaser.mainCharacter.id;
      let chars = gimloader_default.net.room.serializer.state.characters;
      this.unOnAdd = chars.onAdd((e) => {
        if (!e || e.id === this.myId) return;
        if (this.kickIdle) {
          let timeout = setTimeout(() => {
            this.colyseusKick(e.id, "being idle");
          }, this.idleDelay);
          this.idleKickTimeouts.set(e.id, timeout);
          const onMove = () => {
            clearTimeout(timeout);
            this.idleKickTimeouts.delete(e.id);
          };
          e.listen("completedInitialPlacement", (val) => {
            if (!val) return;
            setTimeout(() => {
              this.watchPlayerForMove(e, onMove);
            }, 2e3);
          });
        }
        this.scanPlayersColyseus();
      });
    } else {
      gimloader_default.net.on("UPDATED_PLAYER_LEADERBOARD", this.boundBlueboatMsg);
    }
  }
  boundBlueboatMsg = this.onBlueboatMsg.bind(this);
  onBlueboatMsg(e) {
    this.lastLeaderboard = e.items;
    this.scanPlayersBlueboat();
  }
  watchPlayerForMove(player, callback) {
    let startX = player.x;
    let startY = player.y;
    let unsubX, unsubY;
    const onMove = () => {
      if (unsubX) unsubX();
      if (unsubY) unsubY();
      callback();
    };
    unsubX = player.listen("x", (x) => {
      if (x !== startX) onMove();
    });
    unsubY = player.listen("y", (y) => {
      if (y !== startY) onMove();
    });
  }
  setKickIdle(value) {
    this.kickIdle = value;
    if (gimloader_default.net.type !== "Colyseus") return;
    if (value) {
      for (let [id, char] of gimloader_default.net.room.serializer.state.characters.entries()) {
        if (id === this.myId) continue;
        if (this.idleKickTimeouts.has(id)) continue;
        let timeout = setTimeout(() => {
          this.colyseusKick(id, "being idle");
        }, this.idleDelay);
        this.idleKickTimeouts.set(id, timeout);
        const onMove = () => {
          clearTimeout(timeout);
          this.idleKickTimeouts.delete(id);
        };
        this.watchPlayerForMove(char, onMove);
      }
    } else {
      for (let [id, timeout] of this.idleKickTimeouts.entries()) {
        clearTimeout(timeout);
        this.idleKickTimeouts.delete(id);
      }
    }
  }
  scanPlayers() {
    if (gimloader_default.net.type === "Colyseus") this.scanPlayersColyseus();
    else this.scanPlayersBlueboat();
  }
  scanPlayersBlueboat() {
    if (!this.lastLeaderboard) return;
    let nameCount = /* @__PURE__ */ new Map();
    if (this.kickDuplicateNames) {
      for (let item of this.lastLeaderboard) {
        let name = this.trimName(item.name);
        if (!nameCount.has(name)) nameCount.set(name, 0);
        nameCount.set(name, nameCount.get(name) + 1);
      }
    }
    for (let item of this.lastLeaderboard) {
      if (nameCount.get(this.trimName(item.name)) >= 3) {
        this.blueboatKick(item.id, "duplicate name");
        continue;
      }
      if (this.checkIfNameBlacklisted(item.name)) {
        this.blueboatKick(item.id, "blacklisted name");
      }
    }
  }
  scanPlayersColyseus() {
    let characters = gimloader_default.net.room.state.characters;
    let nameCount = /* @__PURE__ */ new Map();
    if (this.kickDuplicateNames) {
      for (let [_, player] of characters.entries()) {
        let name = this.trimName(player.name);
        if (!nameCount.has(name)) nameCount.set(name, 0);
        nameCount.set(name, nameCount.get(name) + 1);
      }
    }
    for (let [id, player] of characters.entries()) {
      if (id === this.myId) continue;
      let name = this.trimName(player.name);
      if (this.kickDuplicateNames) {
        if (nameCount.get(name) >= 3) {
          this.colyseusKick(id, "duplicate name");
        }
      }
      if (this.checkIfNameBlacklisted(name)) {
        this.colyseusKick(id, "blacklisted name");
      }
      if (this.kickSkinless) {
        let skin = JSON.parse(player.appearance.skin).id;
        if (skin.startsWith("character_default_")) {
          this.colyseusKick(id, "not having a skin");
        }
      }
    }
  }
  trimName(name) {
    return name.toLowerCase().replace(/\d+$/, "").trim();
  }
  checkIfNameBlacklisted(name) {
    name = this.trimName(name);
    for (let filter of this.blacklist) {
      if (filter.exact) {
        if (name === filter.name.toLowerCase()) {
          return true;
        }
      } else {
        console.log(name, filter.name.toLowerCase(), name.includes(filter.name.toLowerCase()));
        if (name.includes(filter.name.toLowerCase())) {
          return true;
        }
      }
    }
    return false;
  }
  colyseusKick(id, reason) {
    if (this.kicked.has(id)) return;
    this.kicked.add(id);
    let char = gimloader_default.net.room.state.characters.get(id);
    gimloader_default.net.send("KICK_PLAYER", { characterId: id });
    gimloader_default.notification.open({ message: `Kicked ${char.name} for ${reason}` });
  }
  blueboatKick(id, reason) {
    if (this.kicked.has(id)) return;
    this.kicked.add(id);
    let playername = this.lastLeaderboard.find((e) => e.id === id)?.name;
    gimloader_default.net.send("KICK_PLAYER", id);
    gimloader_default.notification.open({ message: `Kicked ${playername} for ${reason}` });
  }
  dispose() {
    this.unOnAdd?.();
    gimloader_default.net.off("UPDATED_PLAYER_LEADERBOARD", this.boundBlueboatMsg);
  }
};

// src/ui.tsx
function UI({ autoKicker: autoKicker2 }) {
  const React = gimloader_default.React;
  let [kickDuplicated, setKickDuplicated] = React.useState(autoKicker2.kickDuplicateNames);
  let [kickSkinless, setKickSkinless] = React.useState(autoKicker2.kickSkinless);
  let [kickIdle, setKickIdle] = React.useState(autoKicker2.kickIdle);
  let [kickIdleDelay, setKickIdleDelay] = React.useState(autoKicker2.idleDelay);
  let [blacklist, setBlacklist] = React.useState(autoKicker2.blacklist);
  return /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "root" }, /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "checkboxes" }, /* @__PURE__ */ gimloader_default.React.createElement("label", null, "Kick duplicates"), /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "checkbox",
      checked: kickDuplicated,
      onChange: (e) => {
        autoKicker2.kickDuplicateNames = e.target.checked;
        setKickDuplicated(e.target.checked);
        autoKicker2.scanPlayers();
        autoKicker2.saveSettings();
      },
      onKeyDown: (e) => e.preventDefault()
    }
  ), /* @__PURE__ */ gimloader_default.React.createElement("label", null, "Kick skinless"), /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "checkbox",
      checked: kickSkinless,
      onChange: (e) => {
        autoKicker2.kickSkinless = e.target.checked;
        setKickSkinless(e.target.checked);
        autoKicker2.scanPlayers();
        autoKicker2.saveSettings();
      },
      onKeyDown: (e) => e.preventDefault()
    }
  ), /* @__PURE__ */ gimloader_default.React.createElement("label", null, "Kick Idle"), /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "checkbox",
      checked: kickIdle,
      onChange: (e) => {
        setKickIdle(e.target.checked);
        autoKicker2.setKickIdle(e.target.checked);
        autoKicker2.saveSettings();
      },
      onKeyDown: (e) => e.preventDefault()
    }
  )), kickIdle && /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "idleDelaySlider" }, /* @__PURE__ */ gimloader_default.React.createElement(
    "input",
    {
      type: "range",
      min: "5000",
      max: "60000",
      step: "1000",
      value: kickIdleDelay,
      onChange: (e) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) return;
        setKickIdleDelay(val);
        autoKicker2.idleDelay = val;
        autoKicker2.setKickIdle(false);
        autoKicker2.setKickIdle(true);
        autoKicker2.saveSettings();
      }
    }
  ), /* @__PURE__ */ gimloader_default.React.createElement("label", null, kickIdleDelay, "ms")), /* @__PURE__ */ gimloader_default.React.createElement("h2", null, "Blacklist"), /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "blacklist" }, blacklist.map((entry) => {
    return /* @__PURE__ */ gimloader_default.React.createElement("button", { className: "rule", key: entry.name }, /* @__PURE__ */ gimloader_default.React.createElement("div", { className: "name" }, entry.name), /* @__PURE__ */ gimloader_default.React.createElement("button", { className: "exact", onClick: () => {
      entry.exact = !entry.exact;
      setBlacklist([...blacklist]);
      autoKicker2.scanPlayers();
      autoKicker2.saveSettings();
    } }, entry.exact ? "Exact" : "Contains"), /* @__PURE__ */ gimloader_default.React.createElement("button", { className: "delete", onClick: () => {
      autoKicker2.blacklist = autoKicker2.blacklist.filter((e) => e.name !== entry.name);
      setBlacklist([...autoKicker2.blacklist]);
      autoKicker2.saveSettings();
    } }, "\u{1F5D1}"));
  }), /* @__PURE__ */ gimloader_default.React.createElement("button", { className: "add", onClick: () => {
    let name = prompt("Enter the name to blacklist");
    if (!name) return;
    name = name.trim();
    autoKicker2.blacklist.push({
      name,
      exact: true
    });
    setBlacklist([...autoKicker2.blacklist]);
    autoKicker2.scanPlayers();
    autoKicker2.saveSettings();
  } }, "+")));
}

// src/index.ts
var autoKicker = new AutoKicker();
var ui = null;
var uiShown = gimloader_default.storage.getValue("uiShown", true);
var checkStart = () => {
  if (gimloader_default.net.isHost) {
    autoKicker.start();
    ui = document.createElement("div");
    ui.id = "AutoKick-UI";
    gimloader_default.ReactDOM.createRoot(ui).render(gimloader_default.React.createElement(UI, { autoKicker }));
    document.body.appendChild(ui);
    if (!uiShown) {
      ui.style.display = "none";
      if (autoKicker.kickDuplicateNames || autoKicker.kickSkinless || autoKicker.blacklist.length > 0 || autoKicker.kickIdle) {
        gimloader_default.notification.open({ message: "AutoKicker is running!" });
      }
    }
  }
};
gimloader_default.hotkeys.addConfigurableHotkey({
  category: "Auto Kicker",
  title: "Toggle UI",
  preventDefault: false,
  default: {
    key: "KeyK",
    alt: true
  }
}, () => {
  if (!ui) return;
  uiShown = !uiShown;
  if (uiShown) ui.style.display = "block";
  else ui.style.display = "none";
  gimloader_default.storage.setValue("uiShown", uiShown);
});
gimloader_default.net.onLoad(checkStart);
gimloader_default.UI.addStyles(styles_default);
