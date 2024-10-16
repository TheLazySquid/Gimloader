/**
 * @name PerformantGims
 * @description Replaces gims with images of them. Looks like crap, runs really fast.
 * @author TheLazySquid
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/PerformantGims.js
 * @reloadRequired ingame
 */

GL.parcel.interceptRequire("PerformantGims", exports => exports?.default?.toString?.().includes('this,"applyEditStyles"'), exports => {
    delete exports.default;
    exports.default = class {
        skinId = "character_default_cyan"
        latestSkinId = "character_default_cyan"

        constructor(props) {
            this.character = props.character;
            this.scene = props.scene;
        }

        updateSkin(A) {
            A.id = A.id.replace("character_", "");
            let load = this.scene.load.image(`gim-${A.id}`, `https://www.gimkit.com/assets/map/characters/spine/preview/${A.id}.png`);
            load.on("complete", () => {
                this.setupSkin({
                    id: A.id
                });
            })
            load.start();
        }
        setupSkin(A) {
            let x = A.x ?? this.character.spine.x;
            let y = A.y ?? this.character.spine.y;

            if(this.character.spine) this.character.spine.destroy(true);
            this.character.scale.baseScale = 0.7
            this.character.spine = this.scene.add.sprite(x, y, `gim-${A.id}`);
            this.character.spine.setOrigin(0.5, 0.75);
            this.character.spine.skeleton = {color: {}, physicsTranslate: () => {}};
            let scale = this.character.scale;
            this.character.spine.setScale(scale.scaleX, scale.scaleY);
        }
        applyEditStyles() {}
    }
})

GL.parcel.interceptRequire("PerformantGims", exports => exports?.ANIMATION_TRACKS?.BODY, exports => {
    delete exports.default;
    exports.default = class {
        destroy() {}
        update() {}
    }
})