/**
 * @name QuickReset
 * @description Quickly lets you restart 2d gamemodes
 * @version 0.1.0
 * @author TheLazySquid
 */

GL.hotkeys.addConfigurable("QuickReset", "reset", () => {
    if(GL.net.type !== "Colyseus") return;
    if(!GL.stores.session.amIGameOwner) return;

    GL.net.colyseus.room.send("END_GAME");
    GL.net.colyseus.room.send("RESTORE_MAP_EARLIER");

    let interval = setInterval(() => {
        GL.net.colyseus.room.send("START_GAME");
    }, 100);

    let unusb = GL.net.colyseus.room.state.session.gameSession.listen("phase", (phase) => {
        if(phase === "countdown") {
            clearInterval(interval);
            unusb();
        }
    });
}, {
    category: "Quick Reset",
    title: "Reset",
    preventDefault: false,
    defaultKeys: new Set(["alt", "r"])
});

export default function onStop() {
    GL.hotkeys.removeConfigurable("QuickReset", "reset");
}