/**
 * @name BringBackBoosts
 * @description Restores boosts in Don't Look Down. Will cause you to desync, so others cannot see you move.
 * @author TheLazySquid
 * @version 0.1.5
 * @reloadRequired true
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/BringBackBoosts.js
 */

if(!GL.pluginManager.isEnabled("DLDTAS") && !GL.pluginManager.isEnabled("Savestates")) {
    let ignoreServer = false;

    // disable the physics state from the server
    GL.parcel.interceptRequire("Boosts", exports => exports?.default?.toString?.().includes("[MOVEMENT]"), exports => {
        let ignoreTimeout;
        let lasers = [];

        const enableBBB = () => {
            console.log("[BBB] Enabled")
            ignoreServer = true;
            lasers = GL.stores.phaser.scene.worldManager.devices.allDevices.filter(d => d.laser);

            GL.notification.open({ message: "Bring Back Boosts active", duration: 2 })

            // override the physics update to manually check for laser collisions
            let physics = GL.stores.phaser.scene.worldManager.physics;
            let showHitLaser = true;

            GL.patcher.after("Boosts", physics, "physicsStep", () => {
                if(!showHitLaser) return;
                let body = GL.stores.phaser.mainCharacter.physics.getBody();
                let translation = body.rigidBody.translation();
                let shape = body.collider.shape;

                let topLeft = {
                    x: (translation.x - shape.radius) * 100,
                    y: (translation.y - shape.halfHeight - shape.radius) * 100
                }
                let bottomRight = {
                    x: (translation.x + shape.radius) * 100,
                    y: (translation.y + shape.halfHeight + shape.radius) * 100
                }

                for(let laser of lasers) {
                    if(!laser.state.active) continue;

                    let start = {
                        x: laser.dots[0].options.x + laser.x,
                        y: laser.dots[0].options.y + laser.y
                    }
                    let end = {
                        x: laser.dots.at(-1).options.x + laser.x,
                        y: laser.dots.at(-1).options.y + laser.y
                    }

                    // check whether the player bounding box overlaps the laser line
                    if(boundingBoxOverlap(start, end, topLeft, bottomRight)) {
                        GL.notification.error({ message: "You hit a laser!", duration: 3.5 })
                        showHitLaser = false;
                        setTimeout(() => {
                            showHitLaser = true;
                        }, 500);
                        break;
                    }
                }
            })
        }
    
        // prevent colyseus from complaining that nothing is registered
        GL.patcher.instead("Boosts", exports, "default", (_, args) => {
            args[0].onMessage("PHYSICS_STATE", (packet) => {
                // teleports are allowed
                if(ignoreServer && !packet.teleport) return;
                moveCharToPos(packet.x / 100, packet.y / 100);

                if(!ignoreServer) {
                    if(ignoreTimeout) clearTimeout(ignoreTimeout);
                    ignoreTimeout = setTimeout(enableBBB, 2500);
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

// functions below AI generated there's no way I'm doing that myself
function boundingBoxOverlap(start, end, topLeft, bottomRight) {
    // check if the line intersects with any of the bounding box sides
    return lineIntersects(start, end, topLeft, { x: bottomRight.x, y: topLeft.y }) ||
        lineIntersects(start, end, topLeft, { x: topLeft.x, y: bottomRight.y }) ||
        lineIntersects(start, end, { x: bottomRight.x, y: topLeft.y }, bottomRight) ||
        lineIntersects(start, end, { x: topLeft.x, y: bottomRight.y }, bottomRight);
}

function lineIntersects(start1, end1, start2, end2) {
    let denominator = ((end1.x - start1.x) * (end2.y - start2.y)) - ((end1.y - start1.y) * (end2.x - start2.x));
    let numerator1 = ((start1.y - start2.y) * (end2.x - start2.x)) - ((start1.x - start2.x) * (end2.y - start2.y));
    let numerator2 = ((start1.y - start2.y) * (end1.x - start1.x)) - ((start1.x - start2.x) * (end1.y - start1.y));

    if(denominator == 0) return numerator1 == 0 && numerator2 == 0;

    let r = numerator1 / denominator;
    let s = numerator2 / denominator;

    return (r >= 0 && r <= 1) && (s >= 0 && s <= 1);
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

export function onStop() {
    GL.parcel.stopIntercepts("Boosts")
    GL.patcher.unpatchAll("Boosts")
}