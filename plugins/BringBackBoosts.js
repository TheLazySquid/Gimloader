/**
 * @name BringBackBoosts
 * @description Restores boosts in Don't Look Down. Will cause you to desync, so others cannot see you move.
 * @author TheLazySquid
 * @version 0.3.2
 * @reloadRequired ingame
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/BringBackBoosts.js
 * @needsLib DLDUtils | https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/libraries/DLDUtils.js
 */

let useOriginalPhysics = GL.storage.getValue("BringBackBoosts", "useOriginalPhysics", false);
const defaultAirMovement = {
    accelerationSpeed: 0.08125,
    decelerationSpeed: 0.08125,
    maxAccelerationSpeed: 0.14130434782608697
}
const originalAirMovement = {
    accelerationSpeed: 0.121875,
    decelerationSpeed: 0.08125,
    maxAccelerationSpeed: 0.155
}

GL.addEventListener("loadEnd", () => {
    if(useOriginalPhysics) {
        GL.platformerPhysics.movement.air = originalAirMovement;
    }
})

export function openSettingsMenu() {
    let div = document.createElement("div");
    div.innerHTML = `<label for="useOriginalPhysics">Use Original Physics</label>
    <input type="checkbox" id="useOriginalPhysics" ${useOriginalPhysics ? "checked" : ""}>`

    div.querySelector("#useOriginalPhysics").addEventListener("change", (e) => {
        useOriginalPhysics = e.target.checked;
        GL.storage.setValue("BringBackBoosts", "useOriginalPhysics", useOriginalPhysics);

        if(useOriginalPhysics) {
            GL.platformerPhysics.movement.air = originalAirMovement;
        } else {
            GL.platformerPhysics.movement.air = defaultAirMovement;
        }
    })

    GL.UI.showModal(div, {
        id: "BringBackBoostsSettings",
        title: "Bring Back Boosts Settings",
        buttons: [{
            text: "Close",
            type: "primary"
        }]
    })
}

// WARNING: The code used in this has been taken from minified Gimkit code and therefore is nearly unreadable. Proceed with caution.
var r, g;

GL.parcel.interceptRequire("Boosts", (exports) => exports?.default?.toString?.().includes(`physics.state.forces.some`), (exports) => {
    r = exports;
})

GL.parcel.interceptRequire("Boosts", (exports) => exports?.isPlatformer && exports?.isEditingPlatformerAndPreferTopDownControls, (exports) => {
    g = exports;
})

GL.parcel.interceptRequire("Boosts", (exports) => exports?.CalculateMovementVelocity, exports => {
    let nativeCalcVel = exports.CalculateMovementVelocity;

    var o = { CharacterPhysicsConsts: GL.platformerPhysics },
        n = { default: GL.stores },
        a = { default: { normal: 310 }},
        I = { PhysicsConstants: {
            tickRate: 12,
            debug: !1,
            skipTilesDebug: !1
        }}

    const C = A => {
        const t = GL.stores.phaser.mainCharacter;
        return t ? (0, g.isPlatformer)() && !(0, g.isEditingPlatformerAndPreferTopDownControls)() ? h(t, A.input) : l(t, A.input) : {
            x: 0,
            y: 0
        }
    },
    h = (A, t) => {
        let e = 0,
            i = 0;
        const s = null == t ? void 0 : t.angle,
            g = null !== s && (s < 90 || s > 270) ? "right" : null !== s && s > 90 && s < 270 ? "left" : "none",
            C = n.default.me.movementSpeed / a.default.normal;
        let h = o.CharacterPhysicsConsts.platformerGroundSpeed * C;
        if (A.physics.state.jump.isJumping) {
            const t = Math.min(o.CharacterPhysicsConsts.jump.airSpeedMinimum.maxSpeed, h * o.CharacterPhysicsConsts.jump.airSpeedMinimum.multiplier);
            h = Math.max(t, A.physics.state.jump.xVelocityAtJumpStart)
        }
        let l = 0;
        "left" === g ? l = -h : "right" === g && (l = h);
        const B = 0 !== l;
        if (g !== A.physics.state.movement.direction && (B && 0 !== A.physics.state.movement.xVelocity && (A.physics.state.movement.xVelocity = 0), A.physics.state.movement.accelerationTicks = 0, A.physics.state.movement.direction = g), A.physics.state.movement.xVelocity !== l) {
            A.physics.state.movement.accelerationTicks += 1;
            let t = 0,
                i = 0;
            A.physics.state.grounded ? B ? (t = o.CharacterPhysicsConsts.movement.ground.accelerationSpeed, i = o.CharacterPhysicsConsts.movement.ground.maxAccelerationSpeed) : t = o.CharacterPhysicsConsts.movement.ground.decelerationSpeed : B ? (t = o.CharacterPhysicsConsts.movement.air.accelerationSpeed, i = o.CharacterPhysicsConsts.movement.air.maxAccelerationSpeed) : t = o.CharacterPhysicsConsts.movement.air.decelerationSpeed;
            const s = 20 / I.PhysicsConstants.tickRate;
            t *= A.physics.state.movement.accelerationTicks * s, i && (t = Math.min(i, t)), e = l > A.physics.state.movement.xVelocity ? Phaser.Math.Clamp(A.physics.state.movement.xVelocity + t, A.physics.state.movement.xVelocity, l) : Phaser.Math.Clamp(A.physics.state.movement.xVelocity - t, l, A.physics.state.movement.xVelocity)
        } else e = l;
        return A.physics.state.grounded && A.physics.state.velocity.y > o.CharacterPhysicsConsts.platformerGroundSpeed * C && Math.sign(e) === Math.sign(A.physics.state.velocity.x) && (e = A.physics.state.velocity.x), A.physics.state.movement.xVelocity = e, A.physics.state.gravity = (0, r.default)(A.id), i += A.physics.state.gravity, A.physics.state.forces.forEach(((A, t) => {
            const s = A.ticks[0];
            s && (e += s.x, i += s.y), A.ticks.shift()
        })), {
            x: e,
            y: i
        }
    },
    l = (A, t) => {
        if (!t || null === t.angle) return {
            x: 0,
            y: 0
        };
        const e = n.default.me.movementSpeed / a.default.normal;
        let i = o.CharacterPhysicsConsts.topDownBaseSpeed;
        (0, g.isEditingPlatformerAndPreferTopDownControls)() && (i = o.CharacterPhysicsConsts.platformerGroundSpeed);
        const s = i * e,
            r = Phaser.Math.DegToRad(t.angle);
        let I = Math.cos(r) * s,
            C = Math.sin(r) * s;
        return I = Math.round(1e3 * I) / 1e3, C = Math.round(1e3 * C) / 1e3, {
            x: I,
            y: C
        }
    }

    GL.patcher.instead("Boosts", exports, "CalculateMovementVelocity", (_, args) => {
        if(!r || !g) return nativeCalcVel(...args);
        return C(...args);
    })
})