export function onceOrIfLoaded(callback: () => void) {
    if(GL.net.type === "Colyseus") callback();
    GL.addEventListener("loadEnd", () => {
        if(GL.net.type === "Colyseus") callback();
    }, { once: true })
}