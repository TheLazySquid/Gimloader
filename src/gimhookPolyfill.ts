import type { Gimloader } from './gimloader'

// spec: https://codeberg.org/gimhook/gimhook/src/branch/master/docs/sdk/api.md
// Several features were recently removed from gimhook which this polyfill actually adds back
// This means that more gimhook mods are compatible with gimloader than gimhook lol

export function gimhookPolyfill(gimloader: Gimloader) {
    let gimhook: any = {
        game: {
            isGameActive: false,
            is2DGamemode: false,
            get colyseusInstance() {
                return {
                    room: gimloader.net.colyseus.room
                }
            }
        },
        ui: {},
        graphics: { player: {}, camera: {} },
        hooks: { require: [], message: [], join: [] },
        addHook(type: string, callback: (...args: any) => void) {
            switch(type) {
                case "require":
                    gimloader.parcel.onModuleRequired(null, callback);
                    break;
                case "message":
                    // this could also work for blueboat but Gimhook doesn't do that
                    gimloader.net.colyseus.addEventListener("*", (packet: any) => {
                        // if the function returns true then other handlers should theoretically be skipped, but this is not implemented
                        callback(packet.detail.channel, packet.detail.message);
                    })
                    break;
                case "join":
                    gimloader.addEventListener("loadEnd", () => {
                        callback();
                    })
                    break;
                default:
                    return
            }

            gimhook.hooks[type].push(callback);
        },
        getHooks(type: string) {
            return gimhook.hooks[type];
        }
    };

    // gimhook.graphics.player
    const getPlayer = () => {
        return gimloader.stores?.phaser?.mainCharacter;
    }

    gimhook.graphics.player.getPlayer = getPlayer;

    gimhook.graphics.player.getPosition = () => {
        return getPlayer()?.body ?? { x: 0, y: 0 };
    }

    gimhook.graphics.player.setPosition = (x: number, y: number) => {
        getPlayer()?.physics?.getBody?.()?.rigidBody.setTranslation({ x: x / 100, y: y / 100 });
    }

    // gimhook.graphics.camera
    const getCamera = () => {
        return gimloader.stores?.phaser?.scene?.cameras?.cameras?.[0];
    }

    gimhook.graphics.camera.getCamera = getCamera;

    gimhook.graphics.camera.getZoom = () => {
        return getCamera()?.zoom;
    }

    gimhook.graphics.camera.setZoom = (zoom: number) => {
        getCamera()?.setZoom(zoom);
    }

    // gimhook.game
    gimloader.addEventListener("loadEnd", () => {
        gimhook.game.isGameActive = true;

        if(gimloader.net.type === "Colyseus") {
            gimhook.game.is2DGamemode = true;
        }
    })

    // gimhook.ui
    gimhook.ui.toaster = (message: string) => {
        gimloader.notification.open({ message });
    }

    window.gimhook = gimhook;
    unsafeWindow.gimhook = gimhook;
}