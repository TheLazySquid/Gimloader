import update from "$assets/update.svg";
import { checkLibUpdate, checkPluginUpdate, checkScriptUpdate, compareVersions, scriptUrl } from "$src/net/checkUpdates";
import { parseLibHeader, parsePluginHeader } from "$src/util";
import showErrorMessage from "../showErrorMessage";

export default function UpdateScreen() {
    const React = GL.React;

    let [plugins, setPlugins] = React.useState(GL.pluginManager.plugins);
    let [libs, setLibs] = React.useState(Object.values(GL.lib.libs));

    let [showingCompleted, setShowingCompleted] = React.useState(false);
    let [completed, setCompleted] = React.useState(0);
    let [total, setTotal] = React.useState(0);

    async function checkAll() {
        if(!confirm("Do you want to try to update Gimloader, all plugins, and all libraries?")) return;
        setShowingCompleted(true);

        let promises = [];
        for(let plugin of GL.pluginManager.plugins) {
            if(!plugin.headers.downloadUrl) continue;
            promises.push(new Promise<void>(async (res, rej) => {
                let resp = await GL.net.corsRequest({ url: plugin.headers.downloadUrl })
                    .catch(() => rej(`Failed to update ${plugin.headers.name} from ${plugin.headers.downloadUrl}`));
                    
                if(!resp) return rej();
                setCompleted(completed + 1);

                let headers = parsePluginHeader(resp.responseText);
                let comparison = compareVersions(plugin.headers.version ?? '', headers.version ?? '');

                if(comparison !== 'older') return res();

                plugin.edit(resp.responseText, headers);
            }))
        }

        for(let lib of Object.values(GL.lib.libs)) {
            if(!lib.headers.downloadUrl) continue;
            promises.push(new Promise<void>(async (res, rej) => {
                let resp = await GL.net.corsRequest({ url: lib.headers.downloadUrl })
                    .catch(() => rej(`Failed to update ${lib.headers.name} from ${lib.headers.downloadUrl}`));
                    
                if(!resp) return rej();
                setCompleted(completed + 1);

                let headers = parseLibHeader(resp.responseText);
                let comparison = compareVersions(lib.headers.version ?? '', headers.version ?? '');

                if(comparison !== 'older') return res();

                GL.lib.editLib(lib, resp.responseText, headers);
            }))
        }

        promises.push(new Promise<void>(async (res, rej) => {
            let resp = await GL.net.corsRequest({ url: scriptUrl })
                .catch(() => rej(`Failed to update Gimloader from ${scriptUrl}`));
            if(!resp) return rej();

            setCompleted(completed + 1);

            const versionPrefix = '// @version';
            let index = resp.responseText.indexOf(versionPrefix) + versionPrefix.length;
            let incomingVersion = resp.responseText.slice(index, resp.responseText.indexOf('\n', index)).trim();

            let comparison = compareVersions(GL.version, incomingVersion);
            if(comparison !== 'older') return res();

            location.href = scriptUrl;
            res();
        }))

        setTotal(promises.length);

        let results = await Promise.allSettled(promises);
        let failed = results.filter((r) => r.status === 'rejected') as PromiseRejectedResult[];

        if(failed.length > 0) {
            let msg = `Failed to update ${failed.length} items:\n`
                + failed.map((f) => f.reason).join('\n')
                + '\nDid you allow Gimloader to make Cross-Origin requests?';
            showErrorMessage(msg, "Some Updates Failed");
        }

        setShowingCompleted(false);
    }
    
    return (<div className="gl-updateList">
        <div className="checkAll">
            <div dangerouslySetInnerHTML={{ __html: update }}
            className="updateBtn" onClick={() => checkAll()}></div>
            Check updates for all
        </div>
        {showingCompleted && <progress value={completed}
        max={total}></progress>}
        <h1>Gimloader</h1>
        <div>
            <div dangerouslySetInnerHTML={{ __html: update }}
            className="updateBtn" onClick={() => checkScriptUpdate()}></div>
            Gimloader v{GL.version}
        </div>
        <h1>Plugins</h1>
        {plugins.length === 0 && <div>No plugins loaded</div>}
        {plugins.map((plugin) => {
            return (<div key={plugin.headers.name}>
                {plugin.headers.downloadUrl && <div dangerouslySetInnerHTML={{ __html: update }}
                className="updateBtn" onClick={() => {
                    checkPluginUpdate(plugin)
                        .then(() => setPlugins([...plugins]))
                }}></div>}
                {plugin.headers.name} v{plugin.headers.version}
            </div>)
        })}
        <h1>Libraries</h1>
        {Object.keys(libs).length === 0 && <div>No plugins loaded</div>}
        {Object.values(libs).map((lib) => {
            return (<div key={lib.headers.name}>
                {lib.headers.downloadUrl && <div dangerouslySetInnerHTML={{ __html: update }}
                className="updateBtn" onClick={() => {
                    checkLibUpdate(lib)
                        .then(() => setLibs(Object.values(GL.lib.libs)))
                }}></div>}
                {lib.headers.name} v{lib.headers.version}
            </div>)
        })}
        <hr />
        <div>{navigator.userAgent}</div>
    </div>)
}