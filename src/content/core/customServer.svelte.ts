import type { CustomServerConfig } from "$types/state";
import Port from "$shared/port.svelte";
import Parcel from "$core/parcel";
import Patcher from "$core/patcher";
import UI from "./ui/ui";
import customServerToggle from "$content/ui/server/customServerToggle";
import Storage from "./storage.svelte";

export default new class CustomServer {
    config: CustomServerConfig = $state();

    init(config: CustomServerConfig) {
        this.config = config;

        document.documentElement.classList.toggle("noServerButton", !this.config.enabled);
        Port.on("customServerUpdate", (config) => {
            this.config = config;
            document.documentElement.classList.toggle("noServerButton", !this.config.enabled);
        });        
        this.addJoinToggle();
        
        // requester
        let params = new URLSearchParams(location.search);
        Parcel.getLazy(null, exports => exports?.request && exports?.generateId, exports => {
            Patcher.before(null, exports, "request", (_, args) => {
                if(!config.enabled) return;
                let req = args[0];

                // redirect calls to make custom games to the custom server
                if(
                    (location.pathname === "/join" && Storage.settings.joiningCustomServer && req.url.startsWith("/api/matchmaker")) ||
                    (location.pathname === "/host" && params.get("custom") === "true" && req.url.startsWith("/api/matchmaker")) ||
                    (req.url === "/api/experience/map/hooks" && req.data?.experience?.startsWith("gimloader")) ||
                    (req.url === "/api/matchmaker/intent/map/play/create" && req.data?.experienceId?.startsWith("gimloader"))
                ) {
                    req.url = "/gimloader" + req.url;
                    return;
                }

                // add the experiences from the custom server
                if(req.url === "/api/experiences") {
                    let onSuccess = req.success;

                    Promise.all<any[]>([
                        new Promise(async (res) => {
                            try {
                                let resp = await fetch("/gimloader/api/experiences");
                                let json = await resp.json();
                                res(json);
                            } catch {
                                res([]);
                            }
                        }),
                        new Promise((res) => {
                            Patcher.before(null, req, "success", (_, args) => {
                                res(args[0]);
                            });
                        })
                    ]).then(([ customExperiences, experiences ]) => {
                        onSuccess(customExperiences.concat(experiences));
                    });
                    return;
                }
            });
        });
    }

    updateState(config: CustomServerConfig) {
        this.config = config;
        document.documentElement.classList.toggle("noServerButton", !this.config.enabled);
    }

    save() {
        Port.send("customServerUpdate", $state.snapshot(this.config));
        document.documentElement.classList.toggle("noServerButton", !this.config.enabled);
    }

    addJoinToggle() {
        let innerType = null;

        Parcel.getLazy(null, e => e?.default?.toString?.().includes('inputmode:"numeric"'), (exports) => {
            Patcher.after(null, exports, "default", (_, __, returnVal) => {
                if(innerType) {
                    returnVal.type = innerType;
                    return;
                }

                let type = returnVal.type;
                innerType = function() {
                    let res = type.apply(this, arguments);
                    
                    let controls = res.props.children.props.children[1];
                    let input = controls[0];

                    controls[0] = UI.React.createElement("div",
                    { className: "gl-join-input-wrap" }, [
                        input,
                        UI.React.createElement(customServerToggle)
                    ]);
                    
                    return res;
                }

                returnVal.type = innerType;
            });
        });
    }
}