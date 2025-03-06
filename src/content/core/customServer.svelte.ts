import type { CustomServerConfig } from "$types/state";
import Port from "$shared/port.svelte";

export default new class CustomServer {
    config: CustomServerConfig = $state();

    init(config: CustomServerConfig) {
        this.config = config;

        Port.on("customServerUpdate", (config) => this.config = config);
    }

    updateState(config: CustomServerConfig) {
        this.config = config;
    }

    save() {
        Port.send("customServerUpdate", $state.snapshot(this.config));
    }
}