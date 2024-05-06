import * as CodeCake from "codecake"
import showModal from "./modal";
import PluginManager, { parseHeader } from "../loadPlugins";
import { Plugin } from "../loadPlugins";

export function showCodeEditor(plugins: Plugin[], setPlugins: any, plugin: Plugin, pluginManager: PluginManager) {
    let editorDiv = document.createElement("div");
    editorDiv.addEventListener("keydown", (e) => e.stopPropagation());

    let editor = CodeCake.create(editorDiv, {
        language: "javascript",
        highlight: CodeCake.highlight,
        className: "codecake-dark codeCakeEditor",
        lineNumbers: true
    })

    editor.setCode(plugin.script);

    showModal(editorDiv, {
        title: "Edit Plugin Code",
        style: "width: 90%",
        buttons: [
            {
                text: "cancel",
                style: "close"
            }, {
                text: "save",
                style: "primary",
                onClick() {
                    let code = editor.getCode();
                    let headers = parseHeader(code);

                    // check whether the new name is already taken
                    for(let i = 0; i < plugins.length; i++) {
                        let checkPlugin = plugins[i];
                        if(plugin === checkPlugin) continue;

                        if(checkPlugin.headers.name === headers.name) {
                            let conf = confirm(`A plugin named ${headers.name} already exists. Do you want to overwrite it?`)
                            if(!conf) return true;

                            plugins.splice(i, 1);

                            // shouldn't happen, but just in case
                            i--;
                        }
                    }

                    plugin.disable();
                    plugin.script = code;
                    plugin.headers = headers;
                    plugin.enable();
                    let newPlugins = [...plugins];
                    pluginManager.save(newPlugins);
                    setPlugins(newPlugins);
                }
            }
        ]
    });
}

// can't be bothered with the type
export function createPlugin(plugins: Plugin[], setPlugins: any, pluginManager: PluginManager) {
    let editorDiv = document.createElement("div");
    editorDiv.addEventListener("keydown", (e) => e.stopPropagation());

    let editor = CodeCake.create(editorDiv, {
        language: "javascript",
        highlight: CodeCake.highlight,
        className: "codecake-dark codeCakeEditor",
        lineNumbers: true
    })

    const defaultCode = `/**
* @name New Plugin
* @description A new plugin
* @author Your Name Here
*/`

    editor.setCode(defaultCode);

    showModal(editorDiv, {
        title: "Create New Plugin",
        style: "width: 50%",
        buttons: [
            {
                text: "cancel",
                style: "close"
            }, {
                text: "save",
                style: "primary",
                onClick() {
                    let code = editor.getCode();
                    let headers = parseHeader(code);

                    // check whether the new name is already taken
                    for(let i = 0; i < plugins.length; i++) {
                        let checkPlugin = plugins[i];

                        if(checkPlugin.headers.name === headers.name) {
                            let conf = confirm(`A plugin named ${headers.name} already exists. Do you want to overwrite it?`)
                            if(!conf) return true;

                            plugins.splice(i, 1);

                            // shouldn't happen, but just in case
                            i--;
                        }
                    }

                    let newPlugins = [...plugins, new Plugin(code)];
                    setPlugins(newPlugins);
                    pluginManager.save(newPlugins);
                }
            }
        ]
    });
}