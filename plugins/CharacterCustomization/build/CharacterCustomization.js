/**
 * @name CharacterCustomization
 * @description Allows you to use any gim or a custom gim client-side
 * @author TheLazySquid
 * @version 0.2.2
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/CharacterCustomization/build/CharacterCustomization.js
 */
function UI({ cosmeticChanger, onSubmit }) {
    const React = GL.React;
    let [skinType, setSkinType] = React.useState(cosmeticChanger.skinType);
    let [skinId, setSkinId] = React.useState(cosmeticChanger.skinId);
    let [trailType, setTrailType] = React.useState(cosmeticChanger.trailType);
    let [trailId, setTrailId] = React.useState(cosmeticChanger.trailId);
    let [customSkinFile, setCustomSkinFile] = React.useState(cosmeticChanger.customSkinFile);
    onSubmit(() => {
        cosmeticChanger.setSkin(skinType, skinId, customSkinFile);
        cosmeticChanger.setTrail(trailType, trailId);
    });
    const uploadSkinClick = () => {
        let input = document.createElement("input");
        input.type = "file";
        input.accept = ".png";
        input.onchange = () => {
            let file = input.files?.[0];
            if (!file) {
                setCustomSkinFile(null);
            }
            else {
                setCustomSkinFile(file);
            }
        };
        input.click();
    };
    return (React.createElement("div", { className: "characterCustomization" },
        React.createElement("h1", null, "Skin"),
        React.createElement("div", { className: "row" },
            React.createElement("select", { value: skinType, onChange: (e) => setSkinType(e.target.value) },
                React.createElement("option", { value: "default" }, "Unchanged"),
                React.createElement("option", { value: "id" }, "Any Skin By ID"),
                React.createElement("option", { value: "custom" }, "Custom Skin")),
            skinType === "id" && React.createElement("input", { onKeyDown: (e) => e.stopPropagation(), value: skinId, onChange: (e) => setSkinId(e.target.value), type: "text", placeholder: "Skin ID" }),
            skinType === "custom" && React.createElement("button", { onClick: uploadSkinClick },
                "Current: ",
                customSkinFile ? customSkinFile.name : "None",
                ". Upload skin")),
        React.createElement("h1", null, "Trail"),
        React.createElement("div", { className: "row" },
            React.createElement("select", { value: trailType, onChange: (e) => setTrailType(e.target.value) },
                React.createElement("option", { value: "default" }, "Unchanged"),
                React.createElement("option", { value: "id" }, "Any Trail By ID")),
            trailType === "id" && React.createElement("input", { onKeyDown: (e) => e.stopPropagation(), value: trailId, onChange: (e) => setTrailId(e.target.value), type: "text", placeholder: "Trail ID" }))));
}

var styles = ".characterCustomization .row {\n  display: flex;\n  align-items: center;\n  gap: 5px;\n  width: 500px;\n}\n.characterCustomization select {\n  padding: 3px;\n}";

const unusedSkin = "calacaTwo";
let unusedSkinSrc;
const base = "https://www.gimkit.com/assets/map/characters/spine";
fetch(`${base}/calacaTwo.atlas`)
    .then(res => res.text())
    .then(text => {
    let lines = text.split("\n");
    fetch(`${base}/${lines[1].trim()}`)
        .then(res => res.blob())
        .then(blob => {
        unusedSkinSrc = URL.createObjectURL(blob);
    });
});
class CosmeticChanger {
    skinType = GL.storage.getValue("CharacterCustomization", "skinType", "default");
    trailType = GL.storage.getValue("CharacterCustomization", "trailType", "default");
    skinId = GL.storage.getValue("CharacterCustomization", "skinId", "");
    trailId = GL.storage.getValue("CharacterCustomization", "trailId", "");
    normalSkin = "";
    allowNextSkin = false;
    normalTrail = "";
    allowNextTrail = false;
    authId = GL.stores?.phaser?.mainCharacter?.id ?? "";
    customSkinFile = null;
    constructor() {
        this.initCustomSkinFile();
        let me = this;
        // get the main character ID
        GL.net.colyseus.addEventListener("AUTH_ID", (e) => {
            this.authId = e.detail;
        });
        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if (skin) {
            this.normalSkin = skin.skinId;
            this.patchSkin(skin);
        }
        else {
            // Intercept the class to get the starting skin ID
            GL.parcel.interceptRequire("CharacterCustomization", (exports) => exports?.default?.toString?.().includes("this.latestSkinId"), (exports) => {
                let Skin = exports.default;
                delete exports.default;
                class NewSkin extends Skin {
                    constructor(scene) {
                        super(scene);
                        if (this.character.id === me.authId) {
                            me.patchSkin(this);
                        }
                    }
                }
                exports.default = NewSkin;
            });
        }
        let characterTrail = GL.stores?.phaser?.mainCharacter?.characterTrail;
        if (characterTrail) {
            this.normalTrail = characterTrail.currentAppearanceId;
            this.patchTrail(characterTrail);
        }
        else {
            // Intercept the class to get the starting trail ID
            GL.parcel.interceptRequire("CharacterCustomization", (exports) => exports?.CharacterTrail, (exports) => {
                let CharacterTrail = exports.CharacterTrail;
                delete exports.CharacterTrail;
                class NewCharacterTrail extends CharacterTrail {
                    constructor(scene) {
                        super(scene);
                        if (this.character.id === me.authId) {
                            me.patchTrail(this);
                        }
                    }
                }
                exports.CharacterTrail = NewCharacterTrail;
            });
        }
    }
    async initCustomSkinFile() {
        let file = GL.storage.getValue("CharacterCustomization", "customSkinFile");
        let fileName = GL.storage.getValue("CharacterCustomization", "customSkinFileName");
        if (!file || !fileName)
            return;
        let byteString = atob(file.substring(file.indexOf(",") + 1));
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        this.customSkinFile = new File([ab], fileName);
    }
    patchSkin(skin) {
        if (this.skinType === "id") {
            skin.updateSkin(this.skinId);
        }
        else if (this.skinType === "custom") {
            skin.updateSkin(unusedSkin);
        }
        GL.patcher.before("CharacterCustomization", skin, "updateSkin", (_, args) => {
            if (this.allowNextSkin) {
                this.allowNextSkin = false;
            }
            else {
                this.normalSkin = args[0];
                // cancel the update if we're using a custom skin
                if (this.skinType === "id")
                    return true;
            }
        });
        GL.patcher.after("CharacterCustomization", skin, "setupSkin", () => {
            if (this.skinType === "custom") {
                if (skin.skinId !== unusedSkin)
                    skin.updateSkin(unusedSkin);
                this.applyCustomSkin();
            }
        });
    }
    patchTrail(trail) {
        if (this.trailType === "id") {
            trail.updateAppearance(this.formatTrail(this.trailId));
        }
        GL.patcher.before("CharacterCustomization", trail, "updateAppearance", (_, args) => {
            if (this.allowNextTrail) {
                this.allowNextTrail = false;
            }
            else {
                this.normalTrail = args[0];
                // cancel the update if we're using a custom trail
                if (this.trailType === "id")
                    return true;
            }
        });
    }
    applyCustomSkin() {
        if (!this.customSkinFile)
            return;
        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if (!skin)
            return;
        let entries = skin.character.spine.plugin.spineTextures.entries.entries;
        let texture = entries[unusedSkin]?.pages?.[0]?.texture;
        if (!texture)
            return;
        if (this.skinType === "custom") {
            let url = URL.createObjectURL(this.customSkinFile);
            texture._image.src = url;
            texture._image.addEventListener("load", () => {
                texture.update();
                URL.revokeObjectURL(url);
            }, { once: true });
        }
        else {
            texture._image.src = unusedSkinSrc;
            texture._image.addEventListener("load", () => {
                texture.update();
            }, { once: true });
        }
    }
    async setSkin(skinType, skinId, customSkinFile) {
        this.skinType = skinType;
        this.skinId = skinId;
        this.customSkinFile = customSkinFile;
        // save items to local storage
        GL.storage.setValue("CharacterCustomization", "skinType", skinType);
        GL.storage.setValue("CharacterCustomization", "skinId", skinId);
        if (!customSkinFile) {
            GL.storage.removeValue("CharacterCustomization", "customSkinFile");
            GL.storage.removeValue("CharacterCustomization", "customSkinFileName");
        }
        else {
            let reader = new FileReader();
            reader.onload = () => {
                GL.storage.setValue("CharacterCustomization", "customSkinFile", reader.result);
                GL.storage.setValue("CharacterCustomization", "customSkinFileName", customSkinFile.name);
            };
            reader.readAsDataURL(customSkinFile);
        }
        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if (skin) {
            this.allowNextSkin = true;
            this.applyCustomSkin();
            if (skinType === "id") {
                skin.updateSkin(skinId);
            }
            else if (skinType === "default") {
                skin.updateSkin(this.normalSkin);
            }
            else {
                // load in the custom skin
                skin.updateSkin(unusedSkin);
            }
        }
    }
    formatTrail(trail) {
        if (!trail.startsWith("trail_"))
            return `trail_${trail}`;
        return trail;
    }
    setTrail(trailType, trailId) {
        this.trailType = trailType;
        this.trailId = trailId;
        // save items to local storage
        GL.storage.setValue("ChracterCustomization", "trailType", trailType);
        GL.storage.setValue("ChracterCustomization", "trailId", trailId);
        let characterTrail = GL.stores?.phaser?.mainCharacter?.characterTrail;
        if (characterTrail) {
            this.allowNextTrail = true;
            if (trailType === "id") {
                characterTrail.updateAppearance(this.formatTrail(trailId));
            }
            else {
                characterTrail.updateAppearance(this.normalTrail);
            }
        }
    }
    reset() {
        let characterTrail = GL.stores?.phaser?.mainCharacter?.characterTrail;
        if (characterTrail) {
            characterTrail.updateAppearance(this.normalTrail);
        }
        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if (!skin)
            return;
        skin.updateSkin(this.normalSkin);
        let entries = skin.character.spine.plugin.spineTextures.entries.entries;
        let texture = entries[unusedSkin]?.pages?.[0]?.texture;
        if (!texture)
            return;
        texture._image.src = unusedSkinSrc;
        texture._image.addEventListener("load", () => {
            texture.update();
        }, { once: true });
    }
}

/// <reference types="gimloader" />
let hotkey = new Set(['alt', 'c']);
let cosmeticChanger = new CosmeticChanger();
GL.UI.addStyles("CharacterCustomization", styles);
GL.hotkeys.add(hotkey, () => {
    let submitCallback;
    GL.UI.showModal(GL.React.createElement(UI, {
        cosmeticChanger,
        onSubmit: (callback) => {
            submitCallback = callback;
        }
    }), {
        title: "Character Customization",
        closeOnBackgroundClick: true,
        buttons: [
            {
                text: "Cancel",
                style: "close"
            },
            {
                text: "Apply",
                style: "primary",
                onClick: () => {
                    submitCallback();
                }
            }
        ]
    });
});
function onStop() {
    cosmeticChanger.reset();
    GL.hotkeys.remove(hotkey);
    GL.UI.removeStyles("CharacterCustomization");
    GL.parcel.stopIntercepts("CharacterCustomization");
}

export { onStop };
