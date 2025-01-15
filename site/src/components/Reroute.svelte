<script lang="ts">
    const searchParams = new URLSearchParams(location.search);
    const installUrl = searchParams.get('installUrl');

    if(installUrl) {
        location.href = `/gimloader/install${location.search}`;
    }
</script>