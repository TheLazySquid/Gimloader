import UpdateToast from "$content/ui/UpdateToast.svelte";
import Port from "$shared/port.svelte";
import { mount } from "svelte";
import toast, { Toaster } from "svelte-5-french-toast";

export default class UpdateNotifier {
    static toastId: string | null = null;

    static async init(availableUpdates: string[]) {
        this.mountToaster().then(() => {
            if(availableUpdates.length > 0) {
                this.showToast(availableUpdates);
            }
        });

        Port.on("availableUpdates", (availableUpdates) => {
            if(this.toastId) toast.dismiss(this.toastId);
            if(availableUpdates.length > 0) this.showToast(availableUpdates);
        });
    }

    static showToast(availableUpdates: string[]) {
        // @ts-ignore (library uses SvelteComponent which is outdated)
        this.toastId = toast(UpdateToast, { duration: Infinity, props: { availableUpdates } });
    }

    static async mountToaster() {
        if(document.readyState !== "complete") {
            await new Promise((res) => document.addEventListener("DOMContentLoaded", res, { once: true }));
        }

        mount(Toaster, {
            target: document.body,
            props: { position: "bottom-right" }
        });
    }
}