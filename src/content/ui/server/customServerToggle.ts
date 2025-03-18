import UI from "$core/ui/ui";
import icon from "$assets/icon.svg";
import Storage from "$core/storage.svelte";

export default function customServerToggle() {
    let [enabled, setEnabled] = UI.React.useState(Storage.settings.joiningCustomServer);

    Storage.on("joiningCustomServer", setEnabled);

    UI.React.useEffect(() => () => {
        Storage.off("joiningCustomServer", setEnabled);
    });

    return UI.React.createElement("button", {
        className: "gl-server-toggle",
        title: enabled ? "Joining custom server" : "Joining official server",
        onClick: () => {
            Storage.updateSetting("joiningCustomServer", !enabled);
            setEnabled(!enabled);
        }
    }, enabled ? UI.React.createElement("div", {
        dangerouslySetInnerHTML: { __html: icon }
    }) : UI.React.createElement("img", {
        src: "https://www.gimkit.com/client/img/gimkitGIcon.svg"
    }));
}