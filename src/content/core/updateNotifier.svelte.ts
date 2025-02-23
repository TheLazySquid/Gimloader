import Port from "$shared/port.svelte";
import toast from "svelte-5-french-toast";
import { confirmToast, toasterReady } from "./toaster";

export default class UpdateNotifier {
    static toastId: string | null = null;

    static init(availableUpdates: string[]) {
        toasterReady.then(() => {
            if(availableUpdates.length > 0) {
                this.showToast(availableUpdates);
            }
        });

        Port.on("availableUpdates", this.onUpdate.bind(this));
    }

    static onUpdate(availableUpdates: string[]) {
        if(this.toastId) toast.dismiss(this.toastId);
        if(availableUpdates.length > 0) this.showToast(availableUpdates);
    }

    static showToast(availableUpdates: string[]) {
        let message: string;
        if(availableUpdates.length === 1) {
            message = `${availableUpdates[0]} has an update available. Would you like to download it?`;
        } else if(availableUpdates.length === 2) {
            message = `${availableUpdates[0]} and ${availableUpdates[1]} both have updates available. Would you like to download them?`;
        } else {
            message = `${availableUpdates.slice(0, -1).join(", ")}, and ${availableUpdates[availableUpdates.length - 1]} ` +
            "all have updates available. Would you like to download them?";
        }

        confirmToast(message, (apply) => {
            Port.sendAndRecieve("applyUpdates", { apply });
        });
    }
}