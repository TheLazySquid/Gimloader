import type { CustomServerConfig } from "$types/state";
import Port from "$shared/port.svelte";
import Parcel from "$core/parcel";
import Patcher from "$core/patcher";

export default new class CustomServer {
    config: CustomServerConfig = $state();

    init(config: CustomServerConfig) {
        this.config = config;
        Port.on("customServerUpdate", (config) => this.config = config);

        let params = new URLSearchParams(location.search);

        // requester
        Parcel.getLazy(null, exports => exports?.request && exports?.generateId, exports => {
            Patcher.before(null, exports, "request", (_, args) => {
                if(!config.enabled) return;
                let req = args[0];

                // redirect calls to make custom games to the custom server
                if(
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
    }

    save() {
        Port.send("customServerUpdate", $state.snapshot(this.config));
    }
}