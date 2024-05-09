/**
 * @name Savestates
 * @description Allows you to save and load states/summits in Don't Look Down. Only client side, nobody else can see you move.
 * @author TheLazySquid
 * @version 0.1.0
 * @reloadRequired true
 */

let ignoreServer = false;
if(!GL.pluginManager.isEnabled("DLDTAS") && !GL.pluginManager.isEnabled("BringBackBoosts")) {
    // disable the physics state from the server
    GL.parcel.interceptRequire("TAS", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {

        let ignoreTimeout;
    
        // prevent colyseus from complaining that nothing is registered
        GL.patcher.instead("TAS", exports, "default", (_, args) => {
            args[0].onMessage("PHYSICS_STATE", (packet) => {
                // teleports are allowed
                if(ignoreServer && !packet.teleport) return;
                moveCharToPos(packet.x / 100, packet.y / 100);

                if(!ignoreServer) {
                    if(ignoreTimeout) clearTimeout(ignoreTimeout);
                    ignoreTimeout = setTimeout(() => {
                        console.log("[BBB] Server is being ignored")
                        ignoreServer = true
                    }, 2500);
                }
            })
        })
    })
    
    function moveCharToPos(x, y) {
        let rb = GL.stores?.phaser?.mainCharacter?.physics?.getBody().rigidBody
        if(!rb) return;
    
        rb.setTranslation({ x, y }, true);
    }
}

const summitCoords = [{
    "x": 38.25554275512695,
    "y": 638.3899536132812
}, {
    "x": 90.22997283935547,
    "y": 638.377685546875
}, {
    "x": 285.44000244140625,
    "y": 532.780029296875
}, {
    "x": 217.5500030517578,
    "y": 500.7799987792969
}, {
    "x": 400.3399963378906,
    "y": 413.739990234375
}, {
    "x": 356.5400085449219,
    "y": 351.6600036621094
}, {
    "x": 401.2699890136719,
    "y": 285.739990234375
}]

const defaultState =  '{"gravity":0.001,"velocity":{"x":0,"y":0},"movement":{"direction":"none","xVelocity":0,"accelerationTicks":0},"jump":{"isJumping":false,"jumpsLeft":2,"jumpCounter":0,"jumpTicks":118,"xVelocityAtJumpStart":0},"forces":[],"grounded":true,"groundedTicks":0,"lastGroundedAngle":0}'

let hotkeyEquivs = [')', '!', '@', '#', '$', '%', '^'];
let summitHotkeys = [];
for(let i = 0; i <= 6; i++) {
    // shift + alt + 0-6
    summitHotkeys.push(new Set(['shift', 'alt', hotkeyEquivs[i]]));
}

let saveStateHotkey = new Set(['alt', ',']);
let loadStateHotkey = new Set(['alt', '.']);

GL.addEventListener("loadEnd", () => {
    // add hotkeys for summits
    for(let i = 0; i < summitHotkeys.length; i++) {
        let hotkey = summitHotkeys[i];
        
        GL.hotkeys.add(hotkey, () => {
            ignoreServer = true;

            let physics = GL.stores.phaser.mainCharacter.physics;
            let rb = physics.getBody().rigidBody;

            rb.setTranslation(summitCoords[i], true);

            physics.state = JSON.parse(defaultState);
        })
    }

    let lastPos, lastState;

    // saving
    GL.hotkeys.add(saveStateHotkey, () => {
        let physics = GL.stores.phaser.mainCharacter.physics;
        let rb = physics.getBody().rigidBody;

        lastPos = rb.translation();
        lastState = JSON.stringify(physics.state);

        GL.notification.open({ message: "State Saved", duration: 0.75 })
    })

    // loading
    GL.hotkeys.add(loadStateHotkey, () => {
        let physics = GL.stores.phaser.mainCharacter.physics;
        let rb = physics.getBody().rigidBody;

        if(!lastPos || !lastState) return;

        rb.setTranslation(lastPos, true);
        physics.state = JSON.parse(lastState);

        GL.notification.open({ message: "State Loaded", duration: 0.75 })
    })
})