<script lang="ts">
    import { Table, TableHead, TableHeadCell, TableBody, TableBodyRow, TableBodyCell } from "flowbite-svelte";
    import type Plugin from "../../../pluginManager/plugin";
    import type { LibManagerType } from "../../../lib/libManager";
    import { checkLibUpdate } from "../../../net/checkUpdates";
    import showErrorMessage from "../../showErrorMessage";

    import OpenInNew from "svelte-material-icons/OpenInNew.svelte";
    import Update from "svelte-material-icons/Update.svelte";
    import Download from "svelte-material-icons/Download.svelte";

    export let plugin: Plugin;
    export let libManager: LibManagerType;
    
    interface ILibInfo {
        name: string;
        url?: string;
        required: boolean;
    }

    let libsInfo: ILibInfo[] = [];

    for(let lib of plugin.headers.needsLib) {
        let parts = lib.split('|').map((p: string) => p.trim());
        libsInfo.push({ name: parts[0], url: parts[1], required: true });
    }

    for(let lib of plugin.headers.optionalLib) {
        let parts = lib.split('|').map((p: string) => p.trim());
        libsInfo.push({ name: parts[0], url: parts[1], required: false });
    }

    function downloadLib(name: string, url: string) {
        GL.net.downloadLibrary(url)
            .then(() => libsInfo = libsInfo)
            .catch((err) => showErrorMessage(err, `Failed to download library ${name}`));
    }
</script>

<Table>
    <TableHead>
        <TableHeadCell>Installed?</TableHeadCell>
        <TableHeadCell>Name</TableHeadCell>
        <TableHeadCell>URL</TableHeadCell>
        <TableHeadCell>Required?</TableHeadCell>
        <TableHeadCell></TableHeadCell>
    </TableHead>
    <TableBody>
        {#each libsInfo as libInfo}
            {@const lib = libManager.getLib(libInfo.name)}
            <TableBodyRow>
                <TableBodyCell>{lib ? 'Yes' : 'No'}</TableBodyCell>
                <TableBodyCell>{libInfo.name}</TableBodyCell>
                <TableBodyCell class="max-w-80 text-wrap">
                    {#if libInfo.url}
                        <a class="hover:underline" href={libInfo.url} target="_blank" rel="noopener noreferrer">
                            {libInfo.url}
                            <OpenInNew class="inline-block" size={16} />
                        </a>
                    {:else}
                        None
                    {/if}
                </TableBodyCell>
                <TableBodyCell>{libInfo.required ? 'Yes' : 'No'}</TableBodyCell>
                <TableBodyCell>
                    {#if lib && lib.headers.downloadUrl}
                        <button on:click={() => checkLibUpdate(lib)}>
                            <Update size={25} />
                        </button>
                    {:else if libInfo.url}
                        <button on:click={() => downloadLib(libInfo.name, libInfo.url)}>
                            <Download size={25} />
                        </button>
                    {/if}
                </TableBodyCell>
            </TableBodyRow>
        {/each}
    </TableBody>
</Table>