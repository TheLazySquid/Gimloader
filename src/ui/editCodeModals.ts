import * as CodeCake from "codecake"
import showModal from "./modal";
import PluginManager from "../pluginManager/pluginManager"
import Plugin from "../pluginManager/plugin";
import { parsePluginHeader } from "../util";
import { LibManagerType } from "$src/lib/libManager";
import Lib from "$src/lib/lib";

export function showPluginCodeEditor(plugins: Plugin[], plugin: Plugin, pluginManager: PluginManager) {
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
        id: "core-CodeEditor",
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
                    let headers = parsePluginHeader(code);

                    let canceled = false;
                    for(let otherPlugin of pluginManager.plugins) {
                        if(otherPlugin === plugin) continue;

                        if(otherPlugin.headers.name === headers.name) {
                            canceled = !confirm(`A plugin named ${headers.name} already exists! Do you want to overwrite it?`);
                            break;
                        }
                    }

                    if(canceled) return;

                    for(let otherPlugin of plugins) {
                        if(otherPlugin === plugin || otherPlugin.headers.name !== headers.name) continue;

                        pluginManager.deletePlugin(otherPlugin);
                    }

                    plugin.edit(code, headers);
                    pluginManager.updatePlugins();
                }
            }
        ]
    });
}

export function createPlugin(pluginManager: PluginManager) {
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
        id: "core-CodeEditor",
        title: "Create New Plugin",
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
                    pluginManager.createPlugin(code);
                }
            }
        ]
    });
}
export function showLibCodeEditor(lib: Lib, libManager: LibManagerType) {
    let editorDiv = document.createElement("div");
    editorDiv.addEventListener("keydown", (e) => e.stopPropagation());

    let editor = CodeCake.create(editorDiv, {
        language: "javascript",
        highlight: CodeCake.highlight,
        className: "codecake-dark codeCakeEditor",
        lineNumbers: true
    })

    editor.setCode(lib.script);

    showModal(editorDiv, {
        id: "core-CodeEditor",
        title: "Edit Library Code",
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
                    libManager.editLib(lib, code);
                }
            }
        ]
    });
}

export function createLib(libManager: LibManagerType) {
    let editorDiv = document.createElement("div");
    editorDiv.addEventListener("keydown", (e) => e.stopPropagation());

    let editor = CodeCake.create(editorDiv, {
        language: "javascript",
        highlight: CodeCake.highlight,
        className: "codecake-dark codeCakeEditor",
        lineNumbers: true
    })

    const defaultCode = `/**
* @name New Library
* @description A new library
* @author Your Name Here
* @isLibrary true
*/`

    editor.setCode(defaultCode);

    showModal(editorDiv, {
        id: "core-CodeEditor",
        title: "Create New Library",
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
                    libManager.createLib(code);
                }
            }
        ]
    });
}