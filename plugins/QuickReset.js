/**
 * @name QuickReset
 * @description Quickly lets you restart 2d gamemodes
 * @version 0.2.2
 * @author TheLazySquid
 * @webpage https://thelazysquid.github.io/Gimloader/plugins/quickreset
 * @downloadUrl https://raw.githubusercontent.com/TheLazySquid/Gimloader/refs/heads/main/plugins/QuickReset.js
 */

const api = new GL();

api.hotkeys.addConfigurableHotkey({
    category: "Quick Reset",
    title: "Reset",
    preventDefault: false,
    default: {
        key: "KeyR",
        alt: true
    }
}, () => {
    if(api.net.type !== "Colyseus" || !GL.net.isHost) return;

    api.net.send("END_GAME");
    api.net.send("RESTORE_MAP_EARLIER");

    let interval = setInterval(() => {
        api.net.send("START_GAME");
    }, 100);

    let unusb = api.net.room.state.session.gameSession.listen("phase", (phase) => {
        if(phase === "countdown") {
            clearInterval(interval);
            unusb();
        }
    });
});