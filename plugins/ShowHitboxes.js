/**
 * @name ShowHitboxes
 * @description Shows you the player hitbox used for physics
 * @author TheLazySquid
 * @version 0.1.0
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/main/plugins/ShowHitboxes.js
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/showhitboxes
 */

const api = new GL();

api.net.onLoad((type) => {
    if(type !== "Colyseus") return;

    let scene = api.stores.phaser.scene;
    let physics = scene.worldManager.physics;
    let body = api.stores.phaser.mainCharacter.physics.getBody();
    let shape = body.collider.shape;
    
    // highlight the character's collision box
    let topArc = scene.add.arc(0, shape.halfHeight * -100, shape.radius * 100, 180, 360, false, 0xff0000);
    styleArc(topArc);
    
    let bottomArc = scene.add.arc(0, shape.halfHeight * 100, shape.radius * 100, 0, 180, false, 0xff0000);
    styleArc(bottomArc);

    let leftLine = scene.add.line(shape.radius * -100 + 0.5, 0, 0, 0, 0, shape.halfHeight * 200, 0xff0000);
    leftLine.setLineWidth(1.5);

    let rightLine = scene.add.line(shape.radius * 100 + 0.5, 0, 0, 0, 0, shape.halfHeight * 200, 0xff0000);
    rightLine.setLineWidth(1.5);

    let container = scene.add.container(0, 0, [topArc, bottomArc, leftLine, rightLine]);
    container.setDepth(999999999999);

    api.patcher.after(physics, "physicsStep", () => {
        let translation = body.rigidBody.translation();
        container.setPosition(translation.x * 100, translation.y * 100);
    });

    let objects = [topArc, bottomArc, leftLine, rightLine];

    api.onStop(() => {
        for(let obj of objects) obj.destroy();
    });
});

function styleArc(arc) {
    arc.setStrokeStyle(3, 0xff0000);
    arc.closePath = false;
    arc.isFilled = false;
    arc.isStroked = true;
}