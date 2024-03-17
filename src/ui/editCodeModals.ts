import * as CodeCake from "codecake"
import showModal from "./modal";
import { savePlugins } from "../loadPlugins";
import { Plugin } from "../loadPlugins";

export function showCodeEditor(plugins: Plugin[], setPlugins: any, plugin: Plugin) {
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
        style: "width: 50%",
        buttons: [
            {
                text: "cancel",
                style: "close"
            }, {
                text: "save",
                style: "primary",
                onClick() {
                    plugin.disable();
                    plugin.script = editor.getCode();
                    plugin.enable();
                    let newPlugins = [...plugins];
                    savePlugins(newPlugins);
                    setPlugins(newPlugins);
                }
            }
        ]
    });
}

// can't be bothered with the type
export  function createPlugin(plugins: Plugin[], setPlugins: any) {
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
                    let newPlugins = [...plugins, new Plugin(editor.getCode())];
                    setPlugins(newPlugins);
                    savePlugins(newPlugins);
                }
            }
        ]
    });
}