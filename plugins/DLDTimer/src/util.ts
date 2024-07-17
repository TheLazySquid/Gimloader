export function onceOrIfLoaded(callback: () => void) {
    if(GL.net.type === "Colyseus") callback();
    GL.addEventListener("loadEnd", () => {
        if(GL.net.type === "Colyseus") callback();
    }, { once: true })
}

export function fmtMs(ms: number) {
    ms = Math.round(ms);
    let seconds = Math.floor(ms / 1000);
    let minutes = Math.floor(seconds / 60);

    ms %= 1000;
    seconds %= 60;

    if(minutes > 0) return `${minutes}:${String(seconds).padStart(2, '0')}.${String(ms).padStart(3, '0')}`;
    return `${seconds}.${String(ms).padStart(3, '0')}`;
}