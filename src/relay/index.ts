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

let ready = false;
let messageQueue = [];

port.onMessage.addListener((e) => {
    let message = { ...e, source: "gimloader-in" };
    if(ready) {
        window.postMessage(message);
    } else {
        messageQueue.push(message);
    }
});

window.addEventListener("message", (e) => {
    if(e.data?.source !== "gimloader-out") return;
    if(!e.data?.type) return;

    if(e.data.type === "ready") {
        ready = true;
        for(let message of messageQueue) {
            window.postMessage(message);
        }
        messageQueue = [];
        return;
    }

    port.postMessage(e.data);
});