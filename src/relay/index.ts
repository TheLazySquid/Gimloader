let port: chrome.runtime.Port;
let disconnected = false;
let ready = false;
let messageQueue: any[] = [];

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

    if(disconnected) return;
    port.postMessage(e.data);
});

connect();

function connect() {
    port = chrome.runtime.connect();
    
    // remind firefox that we're still alive every 10 seconds so it doesn't kill the background script
    let pingInterval = setInterval(() => { 
        port.postMessage({ type: "ping" });
    }, 10000);
    
    port.onDisconnect.addListener(() => {
        disconnected = true;
        window.postMessage({ source: "gimloader-in", type: "portDisconnected" });
        clearInterval(pingInterval);

        if(chrome.runtime.lastError) {
            // this probably will never come up since I think firefox
            // straight up nukes the content script when the extension is disabled/reloaded
            // but hey better safe than sorry
            setTimeout(() => connect(), 10000);
        } else {
            connect();
        }
    });
    
    port.onMessage.addListener((e) => {
        disconnected = false;
        let message = { ...e, source: "gimloader-in" };
        if(ready) {
            window.postMessage(message);
        } else {
            messageQueue.push(message);
        }
    });
}