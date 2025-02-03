import ErrorModal from "./components/ErrorModal.svelte";
import { mount, unmount } from "svelte";

export default function showErrorMessage(msg: string, title: string = "Error") {
    const showError = () => {
        let component = mount(ErrorModal, {
            target: document.body,
            props: {
                title,
                msg,
                onClose: () => unmount(component)
            }
        });
    }

    if(document.readyState == "complete") showError();
    else document.addEventListener("DOMContentLoaded", showError, { once: true });
}