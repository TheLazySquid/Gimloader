import plusBoxOutline from "../../assets/plus-box-outline.svg";
import pencilOutline from "../../assets/pencil-outline.svg";
import importSvg from "../../assets/import.svg";
import deleteSvg from "../../assets/delete.svg";
import checkBold from "../../assets/check-bold.svg";
import closeThick from "../../assets/close-thick.svg";
import update from '../../assets/update.svg';

import PluginManager, { Plugin } from "../loadPlugins";
import { createPlugin, showCodeEditor } from "../ui/editCodeModals";
import { checkScriptUpdate, checkPluginUpdate } from "../net/checkScriptUpdate";

export default function PluginManagerUI({ pluginManager }: { pluginManager: PluginManager }) {
    const React = GL.React;
    
    const [plugins, setPlugins] = React.useState(pluginManager.plugins);
    const filePickerInput = React.useRef<HTMLInputElement>(null);

    function importFile() {
        filePickerInput.current?.click();

        filePickerInput.current?.addEventListener("change", async () => {
            let file = filePickerInput.current?.files?.[0];

            if(!file) return;

            // read the file
            let reader = new FileReader();
            reader.addEventListener("load", () => {
                let code = reader.result as string;

                // @ts-ignore compiler option is set but vscode can't tell
                code = code.replaceAll("\r\n", "\n")
                let plugin = new Plugin(code);

                let newPlugins = [...plugins, plugin];

                setPlugins(newPlugins);
                pluginManager.save(newPlugins);
            })

            reader.readAsText(file);
        });
    }

    function deletePlugin(plugin: Plugin) {
        let confirm = window.confirm(`Are you sure you want to delete ${plugin.headers.name}?`);
        if(!confirm) return;

        let newPlugins = plugins.filter(p => p !== plugin);

        setPlugins(newPlugins);
        pluginManager.save(newPlugins);
    }

    function enableAll() {
        let newPlugins = plugins.map(p => {
            p.enable();
            return p;
        });

        setPlugins(newPlugins);
        pluginManager.save(newPlugins);
    }

    function disableAll() {
        let newPlugins = plugins.map(p => {
            p.disable();
            return p;
        });

        setPlugins(newPlugins);
        pluginManager.save(newPlugins);
    }

    return (
        <div className="gl-listWrap">
            <div className="header">
                <button dangerouslySetInnerHTML={{ __html: update }}
                onClick={checkScriptUpdate}></button>
                <button dangerouslySetInnerHTML={{ __html: importSvg }}
                onClick={importFile}></button>
                <input type="file" style={{ display: "none" }}
                accept=".js" ref={filePickerInput} />
                <button dangerouslySetInnerHTML={{ __html: plusBoxOutline }}
                onClick={() => createPlugin(plugins, setPlugins, pluginManager)}></button>
                <div className="right">
                    <button dangerouslySetInnerHTML={{ __html: checkBold }} title="Enable All"
                    onClick={enableAll}></button>
                    <button dangerouslySetInnerHTML={{ __html: closeThick }} title="Disable All"
                    onClick={disableAll}></button>
                </div>
            </div>
            <div className="pluginList">
                {plugins.map((plugin, index) => {
                    return (
                        <div key={index} className="plugin">
                            <div className="info">
                                <div className="top">
                                    <div className="name">
                                        {plugin.headers.name}
                                        {plugin.headers.version ? 
                                        <span className="version">
                                            v{plugin.headers.version}
                                        </span> : null}
                                    </div>
                                    <input type="checkbox" checked={plugin.enabled} onInput={e => {
                                        if(!e.currentTarget.checked) {
                                            plugin.enable();
                                        } else {
                                            plugin.disable();
                                        }

                                        // this re-renders all the plugins (bad) but I don't care
                                        let newPlugins = [...plugins];
                                        setPlugins(newPlugins);
                                        pluginManager.save(newPlugins);
                                    }} />
                                </div>
                                <div className="author">by {plugin.headers.author}</div>
                                <div className="description">{plugin.headers.description}</div>
                            </div>
                            <div className="buttons">
                                {plugin.headers.downloadUrl ? (
                                    <button dangerouslySetInnerHTML={{ __html: update }}
                                    onClick={() => checkPluginUpdate(plugin, () => setPlugins([...plugins]))}>
                                    </button>
                                ) : null}
                                <button dangerouslySetInnerHTML={{ __html: pencilOutline }}
                                onClick={() => showCodeEditor(plugins, setPlugins, plugin, pluginManager)}>
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