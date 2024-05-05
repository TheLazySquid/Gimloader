/**
 * @name CharacterCustomization
 * @description Lets you use whatever character or trail you want client-side. Nobody else can see it.
 * @author TheLazySquid
 * @version 0.1.0
 */

let changeSkinHotkey = new Set(['alt', 's'])
let changeTrailHotkey = new Set(['alt', 't'])

function init() {
    GL.hotkeys.add(changeSkinHotkey, () => {
        GL.hotkeys.releaseAll();

        let mc = GL.stores.phaser.mainCharacter;
        if(!mc) alert("Your character hasn't loaded in yet!")
    
        let skinId = prompt('Enter ID of the skin you want to use:')
        if(!skinId) return
    
        // set the skin
        if(!skinId.startsWith("character_")) skinId = `character_${skinId}`

        // no error handling here, unfortunately
        mc.skin.updateSkin(skinId)
    }, true)
    
    GL.hotkeys.add(changeTrailHotkey, () => {
        GL.hotkeys.releaseAll();

        let mc = GL.stores.phaser.mainCharacter;
        if(!mc) alert("Your character hasn't loaded in yet!")
    
        let trailId = prompt('Enter ID of the trail you want to use:')
        if(!trailId) return
    
        // set the trail
        if(!trailId.startsWith("trail_")) trailId = `trail_${trailId}`

        try {
            mc.characterTrai.updateTrail(trailId)
        } catch(e) {
            alert("Invalid trail ID! Check the Gimkit Wiki page on a trail to find its id.")
        }
    }, true)
}

if(GL.net.type === "Colyseus") init()
else {
    GL.addEventListener('loadEnd', () => {
        if(GL.net.type !== "Colyseus") return
        init();
    })
}

export function onStop() {
    GL.hotkeys.remove(changeSkinHotkey);
    GL.hotkeys.remove(changeTrailHotkey);
}