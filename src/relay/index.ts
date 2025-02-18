let port = chrome.runtime.connect();

// remind firefox that we're still alive every 10 seconds so it doesn't kill the background script
let pingInterval = setInterval(() => { 
    port.postMessage({ type: "ping" });
}, 10000);

// this doesn't appear to fire when the extension is disabled/reloaded for some reason
port.onDisconnect.addListener(() => {
    window.postMessage({ source: "gimloader-in", type: "portDisconnected" });
    clearInterval(pingInterval);
});

port.onMessage.addListener((e) => {
    window.postMessage({ ...e, source: "gimloader-in" });
});

window.addEventListener("message", (e) => {
    if(e.data?.source !== "gimloader-out") return;
    if(!e.data?.type) return;

    port.postMessage(e.data);
});