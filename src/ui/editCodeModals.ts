import showModal from "./modal";
import PluginManager from "../pluginManager/pluginManager"
import Plugin from "../pluginManager/plugin";
import { parsePluginHeader } from "../util";
import type { LibManagerType } from "$src/lib/libManager";
import Lib from "$src/lib/lib";
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState } from "@codemirror/state";
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link';

function createEditorDiv(defaultText: string) {
    let editorDiv = document.createElement("div");
    editorDiv.addEventListener("keydown", (e) => e.stopPropagation());

    let editor = new EditorView({
        state: EditorState.create({
            doc: defaultText,
            extensions: [
                basicSetup,
                oneDark,
                hyperLink,
                keymap.of([indentWithTab]),
                javascript()
            ]
        }),
        parent: editorDiv
    })

    return { editorDiv, editor };
}

export function showPluginCodeEditor(plugins: Plugin[], plugin: Plugin, pluginManager: PluginManager) {
    let { editorDiv, editor } = createEditorDiv(plugin.script);

    showModal(editorDiv, {
        id: "core-CodeEditor",
        title: "Edit Plugin Code",
        style: "width: 90%",
        closeOnBackgroundClick: false,
        buttons: [
            {
                text: "cancel",
                style: "close"
            }, {
                text: "save",
                style: "primary",
                onClick() {
                    let code = editor.state.doc.toString();
                    let headers = parsePluginHeader(code);

                    let canceled = false;
                    for(let otherPlugin of pluginManager.plugins.value) {
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
                    pluginManager.plugins.update();
                }
            }
        ]
    });
}

export function createPlugin(pluginManager: PluginManager) {
    const defaultCode = `/**
* @name New Plugin
* @description A new plugin
* @author Your Name Here
*/`

    let { editorDiv, editor } = createEditorDiv(defaultCode);

    showModal(editorDiv, {
        id: "core-CodeEditor",
        title: "Create New Plugin",
        style: "width: 90%",
        closeOnBackgroundClick: false,
        buttons: [
            {
                text: "cancel",
                style: "close"
            }, {
                text: "save",
                style: "primary",
                onClick() {
                    let code = editor.state.doc.toString();
                    pluginManager.createPlugin(code);
                }
            }
        ]
    });
}
export function showLibCodeEditor(lib: Lib, libManager: LibManagerType) {
    let { editorDiv, editor } = createEditorDiv(lib.script);

    showModal(editorDiv, {
        id: "core-CodeEditor",
        title: "Edit Library Code",
        style: "width: 90%",
        closeOnBackgroundClick: false,
        buttons: [
            {
                text: "cancel",
                style: "close"
            }, {
                text: "save",
                style: "primary",
                onClick() {
                    let code = editor.state.doc.toString();
                    libManager.editLib(lib, code);
                }
            }
        ]
    });
}

export function createLib(libManager: LibManagerType) {
    const defaultCode = `/**
* @name New Library
* @description A new library
* @author Your Name Here
* @isLibrary true
*/`

    let { editorDiv, editor } = createEditorDiv(defaultCode);

    showModal(editorDiv, {
        id: "core-CodeEditor",
        title: "Create New Library",
        style: "width: 90%",
        closeOnBackgroundClick: false,
        buttons: [
            {
                text: "cancel",
                style: "close"
            }, {
                text: "save",
                style: "primary",
                onClick() {
                    let code = editor.state.doc.toString();
                    libManager.createLib(code);
                }
            }
        ]
    });
}