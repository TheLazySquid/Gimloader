import type Plugin from "$src/pluginManager/plugin";

export default function LibraryInfo({ plugin }: { plugin: Plugin }) {
    const React = GL.React;
    
    let libs: [string, string?][] = plugin.headers.needsLib.map(lib => {
        let parts = lib.split('|');
        return [parts[0].trim(), parts[1]?.trim()];
    })

    return (
        <table className="gl-libraryInfo">
            <tr>
                <th>Installed?</th>
                <th>Name</th>
                <th>URL</th>
            </tr>
            {libs.map(lib => {
                return (
                    <tr>
                        <td>{GL.lib.getLib(lib[0]) ? "Yes" : "No"}</td>
                        <td>{lib[0]}</td>
                        <td className="url">{lib[1] ?? ''}</td>
                    </tr>
                )
            })}
        </table>
    )
}