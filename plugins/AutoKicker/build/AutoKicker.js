/**
 * @name AutoKicker
 * @description Automatically kicks players from your lobby with a customizable set of rules
 * @author TheLazySquid
 * @version 0.1.3
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/AutoKicker/build/AutoKicker.js
 */
var styles = "#AutoKick-UI {\n  position: absolute;\n  top: 20px;\n  left: 20px;\n  z-index: 9999;\n  background-color: rgba(0, 0, 0, 0.5);\n  border-radius: 5px;\n}\n#AutoKick-UI .root {\n  display: flex;\n  flex-direction: column;\n  color: white;\n  padding: 10px;\n}\n#AutoKick-UI .checkboxes {\n  display: flex;\n  align-items: center;\n  justify-content: space-around;\n  gap: 5px;\n}\n#AutoKick-UI .idleDelaySlider {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n#AutoKick-UI .idleDelaySlider input {\n  flex-grow: 1;\n}\n#AutoKick-UI .idleDelaySlider label {\n  font-size: 12px;\n}\n#AutoKick-UI h2 {\n  width: 100%;\n  text-align: center;\n  margin-bottom: 5px;\n}\n#AutoKick-UI .blacklist {\n  display: flex;\n  flex-direction: column;\n  gap: 5px;\n  max-height: 500px;\n  overflow-y: auto;\n}\n#AutoKick-UI .blacklist .rule {\n  display: flex;\n  align-items: center;\n  border-radius: 8px;\n  border: 1px solid white;\n  background-color: rgba(0, 0, 0, 0.5);\n}\n#AutoKick-UI .blacklist .rule .name {\n  flex-grow: 1;\n}\n#AutoKick-UI .blacklist .rule .exact {\n  padding: 3px;\n  transition: transform 0.2s;\n  background-color: rgba(0, 0, 0, 0.5);\n  text-decoration: underline;\n  border: none;\n}\n#AutoKick-UI .blacklist .rule .exact:hover {\n  transform: scale(1.05);\n}\n#AutoKick-UI .blacklist .rule .delete {\n  font-size: 20px;\n  border: none;\n  background-color: transparent;\n  transition: transform 0.2s;\n}\n#AutoKick-UI .blacklist .rule .delete:hover {\n  transform: scale(1.05);\n}\n#AutoKick-UI .blacklist .add {\n  font-size: 20px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 8px;\n  border: 1px solid white;\n  background-color: rgba(0, 0, 0, 0.5);\n}";

function UI({ autoKicker }) {
    const React = GL.React;
    let [kickDuplicated, setKickDuplicated] = React.useState(autoKicker.kickDuplicateNames);
    let [kickSkinless, setKickSkinless] = React.useState(autoKicker.kickSkinless);
    let [kickIdle, setKickIdle] = React.useState(autoKicker.kickIdle);
    let [kickIdleDelay, setKickIdleDelay] = React.useState(autoKicker.idleDelay);
    let [blacklist, setBlacklist] = React.useState(autoKicker.blacklist);
    return (React.createElement("div", { className: "root" },
        React.createElement("div", { className: "checkboxes" },
            React.createElement("label", null, "Kick duplicates"),
            React.createElement("input", { type: "checkbox", checked: kickDuplicated, onChange: (e) => {
                    autoKicker.kickDuplicateNames = e.target.checked;
                    setKickDuplicated(e.target.checked);
                    autoKicker.scanPlayers();
                    autoKicker.saveSettings();
                }, onKeyDown: (e) => e.preventDefault() }),
            React.createElement("label", null, "Kick skinless"),
            React.createElement("input", { type: "checkbox", checked: kickSkinless, onChange: (e) => {
                    autoKicker.kickSkinless = e.target.checked;
                    setKickSkinless(e.target.checked);
                    autoKicker.scanPlayers();
                    autoKicker.saveSettings();
                }, onKeyDown: (e) => e.preventDefault() }),
            React.createElement("label", null, "Kick Idle"),
            React.createElement("input", { type: "checkbox", checked: kickIdle, onChange: (e) => {
                    setKickIdle(e.target.checked);
                    autoKicker.setKickIdle(e.target.checked);
                    autoKicker.saveSettings();
                }, onKeyDown: (e) => e.preventDefault() })),
        kickIdle && React.createElement("div", { className: "idleDelaySlider" },
            React.createElement("input", { type: "range", min: "5000", max: "60000", step: "1000", value: kickIdleDelay, onChange: (e) => {
                    let val = parseInt(e.target.value);
                    if (isNaN(val))
                        return;
                    setKickIdleDelay(val);
                    autoKicker.idleDelay = val;
                    // reset the idle kick timeout
                    autoKicker.setKickIdle(false);
                    autoKicker.setKickIdle(true);
                    autoKicker.saveSettings();
                } }),
            React.createElement("label", null,
                kickIdleDelay,
                "ms")),
        React.createElement("h2", null, "Blacklist"),
        React.createElement("div", { className: "blacklist" },
            blacklist.map((entry) => {
                return (React.createElement("button", { className: "rule", key: entry.name },
                    React.createElement("div", { className: "name" }, entry.name),
                    React.createElement("button", { className: "exact", onClick: () => {
                            entry.exact = !entry.exact;
                            setBlacklist([...blacklist]);
                            autoKicker.scanPlayers();
                            autoKicker.saveSettings();
                        } }, entry.exact ? "Exact" : "Contains"),
                    React.createElement("button", { className: "delete", onClick: () => {
                            autoKicker.blacklist = autoKicker.blacklist.filter((e) => e.name !== entry.name);
                            setBlacklist([...autoKicker.blacklist]);
                            autoKicker.saveSettings();
                        } }, "\uD83D\uDDD1")));
            }),
            React.createElement("button", { className: "add", onClick: () => {
                    let name = prompt("Enter the name to blacklist");
                    if (!name)
                        return;
                    name = name.trim();
                    autoKicker.blacklist.push({
                        name,
                        exact: true
                    });
                    setBlacklist([...autoKicker.blacklist]);
                    autoKicker.scanPlayers();
                    autoKicker.saveSettings();
                } }, "+"))));
}

const toggleUIHotkey = new Set(['alt', 'k']);
class AutoKicker {
    myId;
    lastLeaderboard;
    kickDuplicateNames = false;
    kickSkinless = false;
    kickIdle = false;
    blacklist = [];
    idleDelay = 20000;
    el;
    UIVisible = true;
    idleKickTimeouts = new Map();
    unOnAdd;
    kicked = new Set();
    constructor() {
        this.loadSettings();
    }
    loadSettings() {
        let settings = GL.storage.getValue("AutoKicker", "Settings", {});
        this.kickDuplicateNames = settings.kickDuplicateNames ?? false;
        this.kickSkinless = settings.kickSkinless ?? false;
        this.blacklist = settings.blacklist ?? [];
        this.kickIdle = settings.kickIdle ?? false;
        this.idleDelay = settings.idleDelay ?? 20000;
    }
    saveSettings() {
        GL.storage.setValue("AutoKicker", "Settings", {
            kickDuplicateNames: this.kickDuplicateNames,
            kickSkinless: this.kickSkinless,
            blacklist: this.blacklist,
            kickIdle: this.kickIdle,
            idleDelay: this.idleDelay
        });
    }
    start() {
        let root = document.createElement("div");
        root.id = "AutoKick-UI";
        GL.ReactDOM.createRoot(root).render(GL.React.createElement(UI, { autoKicker: this }));
        document.body.appendChild(root);
        GL.hotkeys.add(toggleUIHotkey, () => {
            if (this.UIVisible)
                root.style.display = "none";
            else
                root.style.display = "block";
            this.UIVisible = !this.UIVisible;
        }, true);
        this.el = root;
        if (GL.net.type === "Colyseus") {
            this.myId = GL.stores.phaser.mainCharacter.id;
            let chars = GL.net.colyseus.room.serializer.state.characters;
            this.unOnAdd = chars.onAdd((e) => {
                if (!e || e.id === this.myId)
                    return;
                if (this.kickIdle) {
                    // set and idle kick timeout
                    let timeout = setTimeout(() => {
                        this.colyseusKick(e.id, 'being idle');
                    }, this.idleDelay);
                    this.idleKickTimeouts.set(e.id, timeout);
                    const onMove = () => {
                        clearTimeout(timeout);
                        this.idleKickTimeouts.delete(e.id);
                    };
                    // wait a bit to get the initial packets out of the way
                    e.listen("completedInitialPlacement", (val) => {
                        if (!val)
                            return;
                        setTimeout(() => {
                            this.watchPlayerForMove(e, onMove);
                        }, 2000);
                    });
                }
                this.scanPlayersColyseus();
            });
        }
        else {
            GL.net.blueboat.addEventListener("UPDATED_PLAYER_LEADERBOARD", this.boundBlueboatMsg);
        }
    }
    boundBlueboatMsg = this.onBlueboatMsg.bind(this);
    onBlueboatMsg(e) {
        this.lastLeaderboard = e.detail.items;
        this.scanPlayersBlueboat();
    }
    watchPlayerForMove(player, callback) {
        let startX = player.x;
        let startY = player.y;
        let unsubX, unsubY;
        const onMove = () => {
            if (unsubX)
                unsubX();
            if (unsubY)
                unsubY();
            callback();
        };
        unsubX = player.listen("x", (x) => {
            if (x !== startX)
                onMove();
        });
        unsubY = player.listen("y", (y) => {
            if (y !== startY)
                onMove();
        });
    }
    setKickIdle(value) {
        this.kickIdle = value;
        if (GL.net.type !== "Colyseus")
            return;
        if (value) {
            for (let [id, char] of GL.net.colyseus.room.serializer.state.characters.entries()) {
                if (id === this.myId)
                    continue;
                if (this.idleKickTimeouts.has(id))
                    continue;
                let timeout = setTimeout(() => {
                    this.colyseusKick(id, 'being idle');
                }, this.idleDelay);
                this.idleKickTimeouts.set(id, timeout);
                const onMove = () => {
                    clearTimeout(timeout);
                    this.idleKickTimeouts.delete(id);
                };
                this.watchPlayerForMove(char, onMove);
            }
        }
        else {
            for (let [id, timeout] of this.idleKickTimeouts.entries()) {
                clearTimeout(timeout);
                this.idleKickTimeouts.delete(id);
            }
        }
    }
    scanPlayers() {
        if (GL.net.type === "Colyseus")
            this.scanPlayersColyseus();
        else
            this.scanPlayersBlueboat();
    }
    scanPlayersBlueboat() {
        if (!this.lastLeaderboard)
            return;
        let nameCount = new Map();
        // tally name counts
        if (this.kickDuplicateNames) {
            for (let item of this.lastLeaderboard) {
                let name = this.trimName(item.name);
                if (!nameCount.has(name))
                    nameCount.set(name, 0);
                nameCount.set(name, nameCount.get(name) + 1);
            }
        }
        for (let item of this.lastLeaderboard) {
            if (nameCount.get(this.trimName(item.name)) >= 3) {
                this.blueboatKick(item.id, 'duplicate name');
                continue;
            }
            if (this.checkIfNameBlacklisted(item.name)) {
                this.blueboatKick(item.id, 'blacklisted name');
            }
        }
    }
    scanPlayersColyseus() {
        let characters = GL.net.colyseus.room.state.characters;
        let nameCount = new Map();
        // tally name counts
        if (this.kickDuplicateNames) {
            for (let [_, player] of characters.entries()) {
                let name = this.trimName(player.name);
                if (!nameCount.has(name))
                    nameCount.set(name, 0);
                nameCount.set(name, nameCount.get(name) + 1);
            }
        }
        for (let [id, player] of characters.entries()) {
            if (id === this.myId)
                continue;
            let name = this.trimName(player.name);
            // check name duplication
            if (this.kickDuplicateNames) {
                if (nameCount.get(name) >= 3) {
                    this.colyseusKick(id, 'duplicate name');
                }
            }
            // check filters
            if (this.checkIfNameBlacklisted(name)) {
                this.colyseusKick(id, 'blacklisted name');
            }
            // check the player's skin
            if (this.kickSkinless) {
                let skin = JSON.parse(player.appearance.skin).id;
                if (skin.startsWith("character_default_")) {
                    this.colyseusKick(id, 'not having a skin');
                }
            }
        }
    }
    trimName(name) {
        return name.toLowerCase().replace(/\d+$/, '').trim();
    }
    checkIfNameBlacklisted(name) {
        // remove any trailing numbers
        name = this.trimName(name);
        for (let filter of this.blacklist) {
            if (filter.exact) {
                if (name === filter.name.toLowerCase()) {
                    return true;
                }
            }
            else {
                console.log(name, filter.name.toLowerCase(), name.includes(filter.name.toLowerCase()));
                if (name.includes(filter.name.toLowerCase())) {
                    return true;
                }
            }
        }
        return false;
    }
    colyseusKick(id, reason) {
        if (this.kicked.has(id))
            return;
        this.kicked.add(id);
        let char = GL.net.colyseus.room.state.characters.get(id);
        GL.net.colyseus.send("KICK_PLAYER", { characterId: id });
        GL.notification.open({ message: `Kicked ${char.name} for ${reason}` });
    }
    blueboatKick(id, reason) {
        if (this.kicked.has(id))
            return;
        this.kicked.add(id);
        let playername = this.lastLeaderboard.find((e) => e.id === id)?.name;
        GL.net.blueboat.send("KICK_PLAYER", id);
        GL.notification.open({ message: `Kicked ${playername} for ${reason}` });
    }
    dispose() {
        this.el?.remove();
        this.unOnAdd?.();
        GL.net.blueboat.removeEventListener("UPDATED_PLAYER_LEADERBOARD", this.boundBlueboatMsg);
        GL.hotkeys.remove(toggleUIHotkey);
    }
}

/// <reference types="gimloader" />
// @ts-ignore
let autoKicker = new AutoKicker();
const checkStart = () => {
    if (GL.net.isHost) {
        autoKicker.start();
    }
};
if (GL.net.type === "Colyseus") {
    if (GL.stores)
        checkStart();
    else
        GL.addEventListener("loadEnd", checkStart);
}
else if (GL.net.type === "Blueboat") {
    checkStart();
}
else {
    GL.addEventListener("loadEnd", checkStart);
}
GL.UI.addStyles("AutoKicker", styles);
function onStop() {
    GL.UI.removeStyles("AutoKicker");
    autoKicker.dispose();
}

export { onStop };
