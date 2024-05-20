const unusedSkin = "calacaTwo";
let unusedSkinSrc: string;
const base = "https://www.gimkit.com/assets/map/characters/spine";

fetch(`${base}/calacaTwo.atlas`)
    .then(res => res.text())
    .then(text => {
        let lines = text.split("\n");
        fetch(`${base}/${lines[1].trim()}`)
            .then(res => res.blob())
            .then(blob => {
                unusedSkinSrc = URL.createObjectURL(blob);
            })
    })

export default class CosmeticChanger {
    skinType: string = localStorage.getItem("cc_skinType") ?? "default";
    trailType: string = localStorage.getItem("cc_trailType") ?? "default";
    skinId: string = localStorage.getItem("cc_skinId") ?? "";
    trailId: string = localStorage.getItem("cc_trailId") ?? "";

    normalSkin: string = "";
    allowNextSkin: boolean = false;

    normalTrail: string = "";
    allowNextTrail: boolean = false;

    authId: string = GL.stores?.phaser?.mainCharacter?.id ?? "";

    customSkinFile: File | null = null;

    constructor() {
        this.initCustomSkinFile();

        let me = this;

        // get the main character ID
        GL.net.colyseus.addEventListener("AUTH_ID", (e: any) => {
            this.authId = e.detail;
        })

        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if(skin) {
            this.normalSkin = skin.skinId;

            this.patchSkin(skin);
        } else {
            // Intercept the class to get the starting skin ID
            GL.parcel.interceptRequire("CharacterCustomization",
            (exports) => exports?.default?.toString?.().includes("this.latestSkinId"),
            (exports) => {
                let Skin = exports.default;
    
                delete exports.default;
                class NewSkin extends Skin {
                    constructor(scene: any) {
                        super(scene);
    
                        if(this.character.id === me.authId) {
                            me.patchSkin(this);
                        }
                    }
                }
    
                exports.default = NewSkin;
            })
        }

        let characterTrail = GL.stores?.phaser?.mainCharacter?.characterTrail;
        if(characterTrail) {
            this.normalTrail = characterTrail.currentAppearanceId;

            this.patchTrail(characterTrail);
        } else {
            // Intercept the class to get the starting trail ID
            GL.parcel.interceptRequire("CharacterCustomization",
            (exports) => exports?.CharacterTrail,
            (exports) => {
                let CharacterTrail = exports.CharacterTrail;

                delete exports.CharacterTrail;
                class NewCharacterTrail extends CharacterTrail {
                    constructor(scene: any) {
                        super(scene);

                        if(this.character.id === me.authId) {
                            me.patchTrail(this);
                        }
                    }
                }

                exports.CharacterTrail = NewCharacterTrail;
            })
        }
    }

    async initCustomSkinFile() {
        let file = localStorage.getItem("cc_customSkinFile");
        let fileName = localStorage.getItem("cc_customSkinFileName");
        if(!file || !fileName) return;

        let byteString = atob(file.substring(file.indexOf(",") + 1));
        let ab = new ArrayBuffer(byteString.length);
        let ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        this.customSkinFile = new File([ab], fileName);
    }

    patchSkin(skin: any) {
        if(this.skinType === "id") {
            skin.updateSkin(this.skinId);
        } else if (this.skinType === "custom") {
            skin.updateSkin(unusedSkin);
        }

        GL.patcher.before("CharacterCustomization", skin, "updateSkin", (_, args) => {
            if(this.allowNextSkin) {
                this.allowNextSkin = false;
            } else {
                this.normalSkin = args[0];

                // cancel the update if we're using a custom skin
                if(this.skinType === "id") return true;
            }
        })

        GL.patcher.after("CharacterCustomization", skin, "setupSkin", () => {
            if(this.skinType === "custom") {
                if(skin.skinId !== unusedSkin) skin.updateSkin(unusedSkin);
                this.applyCustomSkin();
            }
        })
    }

    patchTrail(trail: any) {
        if(this.trailType === "id") {
            trail.updateAppearance(this.formatTrail(this.trailId));
        }

        GL.patcher.before("CharacterCustomization", trail, "updateAppearance", (_, args) => {
            if(this.allowNextTrail) {
                this.allowNextTrail = false;
            } else {
                this.normalTrail = args[0];

                // cancel the update if we're using a custom trail
                if(this.trailType === "id") return true;
            }
        })
    }

    applyCustomSkin() {
        if(!this.customSkinFile) return;

        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if(!skin) return;

        let entries = skin.character.spine.plugin.spineTextures.entries.entries
        let texture = entries[unusedSkin]?.pages?.[0]?.texture;
        if(!texture) return;

        if(this.skinType === "custom") {
            let url = URL.createObjectURL(this.customSkinFile);
            texture._image.src = url;
            texture._image.addEventListener("load", () => {
                texture.update();
                URL.revokeObjectURL(url);
            }, { once: true })
        } else {
            texture._image.src = unusedSkinSrc;
            texture._image.addEventListener("load", () => {
                texture.update();
            }, { once: true })
        }
    }

    async setSkin(skinType: string, skinId: string, customSkinFile: File | null) {
        this.skinType = skinType;
        this.skinId = skinId;
        this.customSkinFile = customSkinFile;

        // save items to local storage
        localStorage.setItem("cc_skinType", skinType);
        localStorage.setItem("cc_skinId", skinId);
        if(!customSkinFile) {
            localStorage.removeItem("cc_customSkinFile");
            localStorage.removeItem("cc_customSkinFileName");
        } else {
            let reader = new FileReader();
            reader.onload = () => {
                localStorage.setItem("cc_customSkinFile", reader.result as string);
                localStorage.setItem("cc_customSkinFileName", customSkinFile.name);
            }
            reader.readAsDataURL(customSkinFile);
        }

        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if(skin) {
            this.allowNextSkin = true;
            this.applyCustomSkin();

            if(skinType === "id") {
                skin.updateSkin(skinId);
            } else if(skinType === "default") {
                skin.updateSkin(this.normalSkin);
            } else {
                // load in the custom skin
                skin.updateSkin(unusedSkin);
            }
        }
    }

    formatTrail(trail: string) {
        if(!trail.startsWith("trail_")) return `trail_${trail}`;
        return trail;
    }

    setTrail(trailType: string, trailId: string) {
        this.trailType = trailType;
        this.trailId = trailId;

        // save items to local storage
        localStorage.setItem("cc_trailType", trailType);
        localStorage.setItem("cc_trailId", trailId);

        let characterTrail = GL.stores?.phaser?.mainCharacter?.characterTrail;
        if(characterTrail) {
            this.allowNextTrail = true;

            if(trailType === "id") {
                characterTrail.updateAppearance(this.formatTrail(trailId));
            } else {
                characterTrail.updateAppearance(this.normalTrail);
            }
        }
    }

    reset() {
        let characterTrail = GL.stores?.phaser?.mainCharacter?.characterTrail;
        if(characterTrail) {
            characterTrail.updateAppearance(this.normalTrail);
        }

        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if(!skin) return;

        skin.updateSkin(this.normalSkin);

        let entries = skin.character.spine.plugin.spineTextures.entries.entries
        let texture = entries[unusedSkin]?.pages?.[0]?.texture;

        if(!texture) return
        texture._image.src = unusedSkinSrc;
        texture._image.addEventListener("load", () => {
            texture.update();
        }, { once: true })
    }
}