// @ts-ignore
import atlas from '../assets/gim_atlas.txt';
// @ts-ignore
import json from '../assets/gim_json.txt';

export default class CosmeticChanger {
    skinType: string = GL.storage.getValue("CharacterCustomization", "skinType",  "default");
    trailType: string = GL.storage.getValue("CharacterCustomization", "trailType",  "default");
    skinId: string = GL.storage.getValue("CharacterCustomization", "skinId",  "");
    trailId: string = GL.storage.getValue("CharacterCustomization", "trailId",  "");
    selectedStyles: Record<string, string> = GL.storage.getValue("CharacterCustomization", "selectedStyles",  {});

    normalSkin: string = "";
    allowNextSkin: boolean = false;

    normalTrail: string = "";
    allowNextTrail: boolean = false;

    authId: string = GL.stores?.phaser?.mainCharacter?.id ?? "";

    customSkinFile: File | null = null;
    skinUrl: string | null = null;

    originalImgFileClass: any;

    constructor() {
        this.initCustomSkinFile();

        GL.addEventListener("loadEnd", () => {
            if(GL.net.type !== "Colyseus") return;
            this.loadCustomSkin();
        })

        if(GL.net.type === "Colyseus") {
            this.loadCustomSkin();
        }

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

    loadCustomSkin() {
        if(!this.customSkinFile) return;

        let textureUrl = URL.createObjectURL(this.customSkinFile);
        this.skinUrl = textureUrl;

        let atlasLines = atlas.split("\n");
        atlasLines[0] = textureUrl.split("/").pop()!;
        let atlasBlob = new Blob([atlasLines.join("\n")], {type: "text/plain"});
        let atlasUrl = URL.createObjectURL(atlasBlob);

        let jsonBlob = new Blob([json], {type: "application/json"});
        let jsonUrl = URL.createObjectURL(jsonBlob);

        let fileTypes = (window as any).Phaser.Loader.FileTypes;
        let imgFile = fileTypes.ImageFile;

        class newImgFile extends imgFile {
            constructor(loader: any, key: string, url: string, config: any) {
                if(url === "blob:https://www.gimkit.com/") {
                    url = textureUrl;
                    key = `customSkin-atlas!${textureUrl.split("/").pop()!}`;
                }
                super(loader, key, url, config);
            }
        }

        fileTypes.ImageFile = newImgFile;
        this.originalImgFileClass = imgFile;

        let load = GL.stores.phaser.scene.load;
        let jsonRes = load.spineJson("customSkin-data", jsonUrl);
        let atlasRes = load.spineAtlas("customSkin-atlas", atlasUrl);

        let running = 2;

        const onComplete = () => {
            running--;
            if(running > 0) return;

            URL.revokeObjectURL(textureUrl);
            URL.revokeObjectURL(atlasUrl);
            URL.revokeObjectURL(jsonUrl);

            let skin = GL.stores.phaser.mainCharacter?.skin;
            if(skin && this.skinType === "custom") {
                this.allowNextSkin = true;
                skin.updateSkin({ id: "customSkin" });
            }
        }

        jsonRes.on("complete", onComplete);
        atlasRes.on("complete", onComplete);

        jsonRes.start();
        atlasRes.start();
    }

    async initCustomSkinFile() {
        let file = GL.storage.getValue("CharacterCustomization", "customSkinFile");
        let fileName = GL.storage.getValue("CharacterCustomization", "customSkinFileName");
        if(!file || !fileName) return;

        // stolen from some stackoverflow post
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
            console.log({ id: this.skinId, editStyles: this.selectedStyles });
            skin.updateSkin({ id: this.skinId, editStyles: this.selectedStyles });
        }

        GL.patcher.before("CharacterCustomization", skin, "updateSkin", (_, args) => {
            if(this.allowNextSkin) {
                this.allowNextSkin = false;
            } else {
                this.normalSkin = args[0];

                // cancel the update if we're using a custom skin
                if(this.skinType !== "default") return true;
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

    async setSkin(skinType: string, skinId: string, customSkinFile: File | null, selectedStyles: Record<string, string>) {
        this.skinType = skinType;
        this.skinId = skinId;
        this.customSkinFile = customSkinFile;
        this.selectedStyles = selectedStyles;

        // save items to local storage
        GL.storage.setValue("CharacterCustomization", "skinType", skinType);
        GL.storage.setValue("CharacterCustomization", "skinId", skinId);
        GL.storage.setValue("CharacterCustomization", "selectedStyles", selectedStyles);
        if(!customSkinFile) {
            GL.storage.removeValue("CharacterCustomization", "customSkinFile");
            GL.storage.removeValue("CharacterCustomization", "customSkinFileName");
        } else {
            let reader = new FileReader();
            reader.onload = () => {
                GL.storage.setValue("CharacterCustomization", "customSkinFile", reader.result as string);
                GL.storage.setValue("CharacterCustomization", "customSkinFileName", customSkinFile.name);
            }
            reader.readAsDataURL(customSkinFile);
        }
        
        // update the skin
        let skin = GL.stores?.phaser?.mainCharacter?.skin;
        if(skin) {
            let cache = GL.stores.phaser.scene.cache.custom["esotericsoftware.spine.atlas.cache"];
            // update the custom skin texture
            let entries = cache.entries.entries;
            let texture = entries["customSkin-atlas"]?.pages?.[0]?.texture;

            if(texture && this.customSkinFile) {
                let textureUrl = URL.createObjectURL(this.customSkinFile);
                this.skinUrl = textureUrl;

                texture._image.src = textureUrl;
                texture._image.addEventListener("load", () => {
                    texture.update();
                    URL.revokeObjectURL(textureUrl);
                }, {once: true})
            }
            
            this.allowNextSkin = true;
            if(skinType === "id") {
                skin.updateSkin({ id: "default_gray" });

                // I have no idea why I have to do this, but otherwise styles don't update
                setTimeout(() => {
                    this.allowNextSkin = true;
                    skin.updateSkin({ id: skinId, editStyles: this.selectedStyles });
                }, 0);
            } else if(skinType === "default") {
                skin.updateSkin(this.normalSkin);
            } else {
                skin.updateSkin({ id: "customSkin" });
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
        GL.storage.setValue("ChracterCustomization", "trailType", trailType);
        GL.storage.setValue("ChracterCustomization", "trailId", trailId);

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
        if(skin) {
            skin.updateSkin(this.normalSkin);
        }

        if(this.skinUrl) {
            URL.revokeObjectURL(this.skinUrl);
        }

        if(this.originalImgFileClass) {
            (window as any).Phaser.Loader.FileTypes.ImageFile = this.originalImgFileClass;
        }
    }
}