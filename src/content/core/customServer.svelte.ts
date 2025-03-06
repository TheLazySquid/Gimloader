import type { CustomServerConfig } from "$types/state";
import Port from "$shared/port.svelte";
import toast from "svelte-5-french-toast";

export default new class CustomServer {
    config: CustomServerConfig = $state();

    init(config: CustomServerConfig) {
        this.config = config;

        Port.on("customServerUpdate", (config) => this.config = config);
    }

    updateState(config: CustomServerConfig) {
        this.config = config;
    }

    async save() {
        let worked = await Port.sendAndRecieve("updateCustomServer", $state.snapshot(this.config));
        if(worked) {
            toast.success("Updated custom server!");
        } else {
            toast.error("Invalid custom server address");
        }
    }
}