import showErrorMessage from "$src/ui/showErrorMessage";

export default async function downloadLibraries(needsLibs: string[], confirmName?: string) {
    let missing = [];

    for(let lib of needsLibs) {
        let parts = lib.split('|');
        let libName = parts[0].trim();
        let libUrl = parts[1]?.trim();

        if(!GL.lib.getLib(libName)) {
            missing.push({ libName, libUrl });
        }
    }

    if(missing.length === 0) return true;

    let downloadable = missing.filter(m => m.libUrl);
    
    // wait for user confirmation
    if(confirmName) {
        let single = missing.length === 1;
        let msgStart = `The plugin ${confirmName} is missing ${missing.length} ${single ? 'library' : 'libraries'}.`;
        if(downloadable.length === 0) {
            alert(`${msgStart} You will need to manually download and install ${single ? 'it' : 'them'}.`)
            return false;
        }

        let conf: boolean = false;
        if(downloadable.length === missing.length) {
            conf = confirm(`${msgStart} Would you like to download ${single ? 'it' : 'them'}?`);
        } else {
            conf = confirm(msgStart +
                ` ${downloadable.length} ${single ? 'is' : 'are'} able to be automatically downloaded. Would you like to do so?` +
                " The rest will need to be manually downloaded and installed.");
        }
    
        if(!conf) return false;
    }

    let results = await Promise.allSettled(downloadable.map(({ libName, libUrl }) => {
        return new Promise<string>((res, rej) => {
            GL.net.corsRequest({ url: libUrl })
                .then((resp) => {
                    if(resp.status !== 200) {
                        rej(`Failed to download library ${libName} from ${libUrl}\nRecieved response status of ${resp.status}`);
                        return;
                    }
                    res(resp.responseText)
                })
                .catch(() => rej(`Failed to download library ${libName} from ${libUrl}`));
        })
    }))

    let successes = results.filter(r => r.status === 'fulfilled') as PromiseFulfilledResult<string>[];
    let libs = successes.map(s => GL.lib.createLib(s.value)).filter(l => l);
    await Promise.all(libs.map(l => l.enable()));

    GL.lib.save();
    GL.lib.libs.update();

    let failed = results.filter(r => r.status === 'rejected') as PromiseRejectedResult[];
    if(failed.length > 0) {
        let msg = failed.map(f => f.reason).join('\n');
        showErrorMessage(msg, `Failed to download ${failed.length} libraries`);
        return false;
    }

    return missing.length === downloadable.length;
}

export async function downloadLibrary(url: string) {
    return new Promise<void>((res, rej) => {
        GL.net.corsRequest({ url })
            .then((resp) => {
                if(resp.status !== 200) {
                    rej(`Failed to download library from ${url}\nRecieved response status of ${resp.status}`);
                    return;
                }
                GL.lib.createLib(resp.responseText);
                res();
            })
            .catch(() => rej(`Failed to download library from ${url}`));
    })
}