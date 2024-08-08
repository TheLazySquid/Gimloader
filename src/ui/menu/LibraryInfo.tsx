import type Plugin from "$src/pluginManager/plugin";
import download from "$assets/download.svg";
import update from "$assets/update.svg";
import { checkLibUpdate } from "$src/net/checkUpdates";
import { downloadLibrary } from "$src/net/downloadLibraries";
import showErrorMessage from "../showErrorMessage";

export default function LibraryInfo({ plugin }: { plugin: Plugin }) {
    const React = GL.React;
    
    let mandatoryLibs = plugin.headers.needsLib.map((lib: string) => {
        let parts = lib.split('|');
        return [parts[0].trim(), parts[1]?.trim(), true];
    });

    let optionalLibs = plugin.headers.optionalLib.map((lib: string) => {
        let parts = lib.split('|');
        return [parts[0].trim(), parts[1]?.trim(), false];
    })

    let [libs, setLibs] = React.useState<[string, string | undefined, boolean][]>(mandatoryLibs.concat(optionalLibs));

    return (
        <table className="gl-libraryInfo">
            <tr>
                <th>Installed?</th>
                <th>Name</th>
                <th>URL</th>
                <th>Required?</th>
                <th></th>
            </tr>
            {libs.map(lib => {
                return (
                    <tr>
                        <td>{GL.lib.getLib(lib[0]) ? "Yes" : "No"}</td>
                        <td>{lib[0]}</td>
                        <td className="url">{lib[1] ?? ''}</td>
                        <td>{lib[2] ? "Yes" : "No"}</td>
                        <td>
                            {lib[1] && !GL.lib.getLib(lib[0]) && (
                                <div className="updateBtn" dangerouslySetInnerHTML={{ __html: download }}
                                onClick={() => {
                                    downloadLibrary(lib[1])
                                        .then(() => {
                                            setLibs([...libs]);
                                            GL.notification?.open({ message: `Downloaded library ${lib[0]}` })
                                        })
                                        .catch((err) => {
                                            console.log(err);
                                            showErrorMessage(err, `Failed to download library ${lib[0]}`)
                                        })
                                }}></div>
                            )}
                            {lib[1] && GL.lib.getLib(lib[0]) && (
                                <div className="updateBtn" dangerouslySetInnerHTML={{ __html: update }}
                                onClick={() => checkLibUpdate(GL.lib.getLib(lib[0]))}></div>    
                            )}
                        </td>
                    </tr>
                )
            })}
        </table>
    )
}