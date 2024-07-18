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

export interface Area {
    x: number,
    y: number,
    direction: "right" | "left"
}

export interface Coords {
    x: number,
    y: number

}

export function inArea(coords: Coords, area: Area) {
    if(area.direction === "right" && coords.x < area.x) return false;
    if(area.direction === "left" && coords.x > area.x) return false;
    if(coords.y > area.y + 10) return false; // little bit of leeway
    return true;
}