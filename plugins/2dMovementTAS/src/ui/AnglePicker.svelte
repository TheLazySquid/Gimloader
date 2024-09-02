<script lang="ts">
    export let angle: number = 0;
    $: if(angle === null) angle = 0;

    export function getAngle() {
        return angle;
    }

    let circle: HTMLElement;
    let dragging = false;

    function onMousedown(e: MouseEvent) {
        dragging = true;
        updateAngle(e);
    }

    function updateAngle(e: MouseEvent) {
        if(!dragging) return;
        let rect = circle.getBoundingClientRect();
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        let newAngle = Math.atan2(y - 50, x - 50) * 180 / Math.PI;
        angle = Math.round((newAngle + 360) % 360 * 100) / 100;
    }
</script>

<svelte:window on:pointerup={() => dragging = false}
    on:pointermove={updateAngle} />

<div>
    <div class="circleWrap">
        <div class="circle" bind:this={circle}
        on:pointerdown={onMousedown}>
            <div class="pointer" style="transform: rotate({angle - 90}deg)"></div>
        </div>
    </div>
    <div class="inputs">
        <input type="range" min="0" max="360" step="0.01" bind:value={angle} />
        <div>
            <input class="numInput" type="number" min="0" max="360" bind:value={angle} />
            <span>°</span>
        </div>
    </div>
</div>

<style>
    .circleWrap {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .circle {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: #f0f0f0;
        position: relative;
    }

    .pointer {
        width: 2px;
        height: 50px;
        background-color: #000;
        position: absolute;
        top: 50%;
        left: 50%;
        transform-origin: 0 0;
    }

    .inputs {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .numInput {
        border: none;
        border-bottom: 1px solid black;
    }
</style>