import ErrorModal from "./ErrorModal.svelte";

export default function showErrorMessage(msg: string, title: string = "Error") {
    let component = new ErrorModal({
        target: document.body,
        props: {
            title,
            msg,
            onClose: () => component.$destroy()
        }
    })
}