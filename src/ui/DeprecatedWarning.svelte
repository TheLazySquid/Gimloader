<script lang="ts">
    import Modal from './flowbite/Modal.svelte';

	let { onclose } = $props();
</script>

<div class="preflight">
	<Modal open on:close={onclose}>
		<div class="w-full flex items-center flex-col">
			<h1 class="text-2xl">Gimloader has moved to an extension!</h1>
			<h2 class="text-xl">This userscript will no longer be maintained and may stop working.</h2>
			<p class="w-full">
				If you use a Chromium browser such as such as Chrome, Edge, Opera, Brave, etc.
				install the extension from the
				<a href="https://chromewebstore.google.com/detail/gimloader/ngbhofnofkggjbpkpnogcdfdgjkpmgka"
				target="_blank" class="underline">
					Chrome Webstore
				</a>.
				If you use Firefox install the extension from
				<a href="https://addons.mozilla.org/en-US/firefox/addon/gimloader/"
				target="_blank" class="underline">
					Mozilla Addons
				</a>.
				Don't forget to remove this userscript afterwards, or things will likely break.
			</p>
		</div>
	</Modal>
</div>