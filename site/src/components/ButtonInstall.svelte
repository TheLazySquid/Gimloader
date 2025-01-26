<script lang="ts">
    let { name, url }: { name: string, url: string } = $props();

    let ready = $state(false);
    let alreadyInstalled = $state(false);
    let installing: Promise<void> | null = $state(null);

    if(document.readyState === "complete") check();
    else window.addEventListener("load", check);

    async function check() {
        if(!(window as any).GLInstall) return;
        
        if((window as any).GLGet(name)) {
            alreadyInstalled = true;
        }

        ready = true;
    }

    function install() {
        if(installing) return;

        installing = new Promise<void>(async (res, rej) => {
            try {
                let resp = await fetch(url);
                let text = await resp.text();
    
                (window as any).GLInstall(text);
                res();
            } catch (e) { rej (e) }
        });
    }
</script>

{#if ready}
    <div class="wrap pt-[65px]">
        <button onclick={install} class="w-full">
            {#if installing}
                {#await installing}
                    Installing...
                {:then} 
                    Installed!
                {:catch}
                    Error installing
                {/await}
            {:else}
                {#if alreadyInstalled}
                    Reinstall Plugin
                {:else}
                    Install Plugin
                {/if}
            {/if}
        </button>
    </div>
{/if}

<style>
    button {
        color: white;
        font-size: 24px;
        border: 1px solid hsl(224, 10%, 23%);
        border-radius: 8px;
        box-shadow: var(--sl-shadow-md);
    }

    :global(.sl-flex .meta) {
        display: none;
    }
</style>