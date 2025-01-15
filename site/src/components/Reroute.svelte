<script lang="ts">
    const searchParams = new URLSearchParams(location.search);
    const installUrl = searchParams.get('installUrl');

    if(installUrl) {
        location.href = `/Gimloader/install${location.search}`;
    }
</script>