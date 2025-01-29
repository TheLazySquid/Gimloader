import showModal from "$content/core/ui/modal";
import Plugin from "$core/pluginManager/plugin.svelte";
import { parsePluginHeader } from "$content/parseHeader";
import Lib from "$content/core/libManager/lib.svelte";
import { javascript } from "@codemirror/lang-javascript";
import { basicSetup } from "codemirror";
import { EditorView, keymap } from "@codemirror/view";
import { indentWithTab } from "@codemirror/commands";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState } from "@codemirror/state";
import { hyperLink } from '@uiw/codemirror-extensions-hyper-link';
import LibManager from "$core/libManager/libManager.svelte";
import PluginManager from "$core/pluginManager/pluginManager.svelte";

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

export function showPluginCodeEditor(plugin: Plugin) {
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
                    for(let otherPlugin of PluginManager.plugins) {
                        if(otherPlugin === plugin) continue;

                        if(otherPlugin.headers.name === headers.name) {
                            canceled = !confirm(`A plugin named ${headers.name} already exists! Do you want to overwrite it?`);
                            break;
                        }
                    }

                    if(canceled) return;

                    for(let otherPlugin of PluginManager.plugins) {
                        if(otherPlugin === plugin || otherPlugin.headers.name !== headers.name) continue;

                        PluginManager.deletePlugin(otherPlugin);
                    }

                    PluginManager.editPlugin(plugin, code);
                }
            }
        ]
    });
}

export function createPlugin() {
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
                    PluginManager.createPlugin(code);
                }
            }
        ]
    });
}
export function showLibCodeEditor(lib: Lib) {
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
                    LibManager.editLibrary(lib, code);
                }
            }
        ]
    });
}

export function createLib() {
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
                    LibManager.createLib(code);
                }
            }
        ]
    });
}