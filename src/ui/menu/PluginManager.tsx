import plusBoxOutline from "$assets/plus-box-outline.svg";
import pencilOutline from "$assets/pencil-outline.svg";
import importSvg from "$assets/import.svg";
import deleteSvg from "$assets/delete.svg";
import checkBold from "$assets/check-bold.svg";
import closeThick from "$assets/close-thick.svg";
import cogOutline from "$assets/cog-outline.svg";
import update from '$assets/update.svg';
import solidBook from '$assets/solid-book.svg';

import Plugin from "../../pluginManager/plugin";
import { createPlugin, showPluginCodeEditor } from "../editCodeModals";
import { checkPluginUpdate } from "../../net/checkUpdates";
import showErrorMessage from "../showErrorMessage";
import LibraryInfo from "./LibraryInfo";

export default function PluginManagerUI() {
    const { React, pluginManager } = GL;
    
    const [plugins, setPlugins] = React.useState(pluginManager.plugins);

    pluginManager.reactSetPlugins = setPlugins;

    function importFile() {
        let filePickerInput = document.createElement("input");
        filePickerInput.accept = ".js";
        filePickerInput.type = "file";
        filePickerInput.click();

        filePickerInput.addEventListener("change", async () => {
            let file = filePickerInput.files?.[0];

            if(!file) return;

            // read the file
            let reader = new FileReader();
            reader.addEventListener("load", async () => {
                let code = reader.result as string;

                code = code.replaceAll("\r\n", "\n")
                pluginManager.createPlugin(code);
            })

            reader.readAsText(file);
        });
    }

    function deletePlugin(plugin: Plugin) {
        let conf = confirm(`Are you sure you want to delete ${plugin.headers.name}?`);
        if(!conf) return;

        pluginManager.deletePlugin(plugin);
    }

    function showLibraries(plugin: Plugin) {
        GL.UI.showModal(<LibraryInfo plugin={plugin} />, {
            title: "Libraries Required by " + plugin.headers.name,
            id: "core-libInfo",
            buttons: [{
                text: "Close",
                style: "primary"
            }]
        })
    }

    return (
        <div className="gl-listWrap">
            <div className="header">
                <button dangerouslySetInnerHTML={{ __html: importSvg }}
                onClick={importFile}></button>
                <button dangerouslySetInnerHTML={{ __html: plusBoxOutline }}
                onClick={() => createPlugin(pluginManager)}></button>
                <button dangerouslySetInnerHTML={{ __html: checkBold }} title="Enable All"
                onClick={() => pluginManager.enableAll()}></button>
                <button dangerouslySetInnerHTML={{ __html: closeThick }} title="Disable All"
                onClick={() => pluginManager.disableAll()}></button>
            </div>
            <div className="scriptList">
                {plugins.map((plugin) => {
                    return (
                        <div key={plugin.headers.name} className="scriptItem">
                            <div className="info">
                                <div className="top">
                                    <div className="name">
                                        {plugin.headers.name}
                                        {plugin.headers.version ? 
                                        <span className="version">
                                            v{plugin.headers.version}
                                        </span> : null}
                                    </div>
                                    <input type="checkbox" checked={plugin.enabled} onInput={async (e) => {
                                        if(!e.currentTarget.checked) {
                                            await plugin.enable()
                                                .catch((e) => showErrorMessage(e.message, `Failed to enable plugin ${plugin.headers.name}`));
                                        }
                                        else plugin.disable();

                                        pluginManager.save();
                                    }} />
                                </div>
                                <div className="author">by {plugin.headers.author}</div>
                                <div className="description">{plugin.headers.description}</div>
                            </div>
                            <div className="buttons">
                                {plugin.headers.downloadUrl ? (
                                    <button dangerouslySetInnerHTML={{ __html: update }}
                                    onClick={() => checkPluginUpdate(plugin)}>
                                    </button>
                                ) : null}
                                {plugin.headers.needsLib.length > 0 || plugin.headers.optionalLib.length > 0 ? (
                                    <button dangerouslySetInnerHTML={{ __html: solidBook }}
                                    onClick={() => showLibraries(plugin)}>
                                    </button>
                                ) : null}
                                {plugin.return?.openSettingsMenu ? (
                                    <button dangerouslySetInnerHTML={{ __html: cogOutline }}
                                    onClick={() => plugin.return.openSettingsMenu()}>
                                    </button>
                                ) : null}
                                <button dangerouslySetInnerHTML={{ __html: pencilOutline }}
                                onClick={() => showPluginCodeEditor(plugins, plugin, pluginManager)}>
                                </button>
                                <button dangerouslySetInnerHTML={{ __html: deleteSvg }}
                                onClick={() => deletePlugin(plugin)}>
                                </button>
                            </div>
                        </div>
                    )
                })}
                {plugins.length === 0 ?
                    <div className="empty">No plugins! Create or import one to get started.</div>
                : null}
            </div>
        </div>
    )
}