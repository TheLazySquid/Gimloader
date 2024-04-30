let canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.id = "tasOverlay";
let ctx = canvas.getContext("2d")!;

window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
})

export function initOverlay() {
    document.body.appendChild(canvas);

    setInterval(render, 1000 / 15);
}

let renderHitbox = true;

export function hideHitbox() {
    renderHitbox = false;
}

export function showHitbox() {
    renderHitbox = true;
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    let physics = GL.stores.phaser.mainCharacter.physics;
    let collider = physics.getBody().collider;
    let { halfHeight, radius } = collider._shape;
    let { x: cX, y: cY } = GL.stores.phaser.scene.cameras.cameras[0].midPoint;
    let { x, y }  = physics.getBody().rigidBody.translation();
    let { x: vX, y: vY } = physics.getBody().rigidBody.linvel();

    // display the current coordinates and velocity of the player
    ctx.fillStyle = "white";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.font = "20px Arial";
    ctx.textAlign = "right";

    const posText = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;
    const velText = `vx: ${vX.toFixed(2)}, vy: ${vY.toFixed(2)}`;

    ctx.strokeText(posText, canvas.width - 10, canvas.height - 20);
    ctx.fillText(posText, canvas.width - 10, canvas.height - 20);
    ctx.strokeText(velText, canvas.width - 10, canvas.height - 40);
    ctx.fillText(velText, canvas.width - 10, canvas.height - 40);

    if(!renderHitbox) return;

    // convert the position to screen space
    x = (x * 100) - cX + window.innerWidth / 2;
    y = (y * 100) - cY + window.innerHeight / 2;

    radius *= 100;
    halfHeight *= 100;

    ctx.strokeStyle = "#2fd45b";
    ctx.lineWidth = 3;

    // render the capsule shaped collider
    ctx.beginPath();
    ctx.arc(x, y - halfHeight, radius, Math.PI, 2 * Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x + radius, y + halfHeight);
    ctx.lineTo(x + radius, y - halfHeight);
    ctx.moveTo(x - radius, y + halfHeight);
    ctx.lineTo(x - radius, y - halfHeight);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(x, y + halfHeight, radius, 0, Math.PI);
    ctx.stroke();
}