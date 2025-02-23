import { mount, unmount } from "svelte";
import DeprecatedWarning from "./ui/DeprecatedWarning.svelte";
import Storage from "./core/storage";

export async function showDeprecated() {
	let lastDismissed = Storage.getValue("deprecatedDismissed", 0);
	let diff = Date.now() - lastDismissed;

	// show every 3 days
	if(diff < 1000 * 60 * 60 * 24 * 3) return;

	if(document.readyState !== "complete") {
		await new Promise((res) => document.addEventListener("DOMContentLoaded", res, { once: true }));
	}
	
	let component = mount(DeprecatedWarning, {
		target: document.body,
		props: {
			onclose: () => {
				Storage.setValue("deprecatedDismissed", Date.now());
				unmount(component);
			}
		}
	});
}