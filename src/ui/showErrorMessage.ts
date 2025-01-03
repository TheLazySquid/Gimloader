import ErrorModal from "./ErrorModal.svelte";
import { mount, unmount } from "svelte";

export default function showErrorMessage(msg: string, title: string = "Error") {
    let component = mount(ErrorModal, {
        target: document.body,
        props: {
            title,
            msg,
            onClose: () => unmount(component)
        }
    });
}