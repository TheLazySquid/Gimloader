import update from '$assets/update.svg';
import importSvg from '$assets/import.svg';
import plusBoxOutline from '$assets/plus-box-outline.svg';
import pencilOutline from '$assets/pencil-outline.svg';
import deleteSvg from '$assets/delete.svg';
import type Lib from '$src/lib/lib';
import { createLib, showLibCodeEditor } from '../editCodeModals';
import { checkLibUpdate } from '$src/net/checkUpdates';

export default function LibManagerUI() {
    const { React, lib: libManager } = GL;

    const [libs, setLibs] = React.useState(libManager.libs);

    libManager.reactSetLibs = setLibs;

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
            reader.addEventListener("load", () => {
                let code = reader.result as string;
                code = code.replaceAll("\r\n", "\n");

                libManager.createLib(code);
            })

            reader.readAsText(file);
        });
    }

    function deleteLib(lib: Lib) {
        let conf = confirm(`Are you sure you want to delete ${lib.headers.name}?`);
        if(!conf) return;

        libManager.deleteLib(lib);
    }

    return (<div className="gl-listWrap">
        <div className="header">
            <button dangerouslySetInnerHTML={{ __html: importSvg }}
            onClick={importFile}></button>
            <button dangerouslySetInnerHTML={{ __html: plusBoxOutline }}
            onClick={() => createLib(libManager)}></button>
        </div>
        <div className="scriptList">
            {Object.values(libs).map((lib) => {
                return (
                    <div key={lib.headers.name} className="scriptItem">
                        <div className="info">
                            <div className="top">
                                <div className="name">
                                    {lib.headers.name}
                                    {lib.headers.version ? 
                                    <span className="version">
                                        v{lib.headers.version}
                                    </span> : null}
                                </div>
                            </div>
                            <div className="author">by {lib.headers.author}</div>
                            <div className="description">{lib.headers.description}</div>
                        </div>
                        <div className="buttons">
                            {lib.headers.downloadUrl ? (
                                <button dangerouslySetInnerHTML={{ __html: update }}
                                onClick={() => checkLibUpdate(lib)}></button>
                            ) : null}
                            <button dangerouslySetInnerHTML={{ __html: pencilOutline }}
                            onClick={() => showLibCodeEditor(lib, libManager)}></button>
                            <button dangerouslySetInnerHTML={{ __html: deleteSvg }}
                            onClick={() => deleteLib(lib)}></button>
                        </div>
                    </div>
                )
            })}
            {Object.keys(libs).length === 0 ?
                <div className="empty">You have no libraries installed. These are used to store code that is shared between plugins.</div>
            : null}
        </div>
    </div>)
}