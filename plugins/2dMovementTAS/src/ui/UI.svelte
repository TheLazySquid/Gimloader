<script lang="ts">
    import { blankFrame, between, showAnglePicker } from '../util';
    import type { IFrame } from '../types';
    import { currentFrame } from "../stores";
    import TASTools from '../tools';

    export let frames: IFrame[];
    export let startPos: { x: number, y: number } | undefined;
    let height: number;
    let offset = 0;
    $: rows = Math.floor(height / 26) - 1;

    $: for(let i = offset; i < offset + rows; i++) {
        if(!frames[i]) frames[i] = { ...blankFrame };
    }

    function setFrames(newFrames: IFrame[]) {
        frames = newFrames;
    }

    let tools = new TASTools(frames, setFrames, startPos);

    function onScroll(e: WheelEvent) {
        if(e.deltaY > 0) offset += 1;
        if(e.deltaY < 0) offset -= 1;
        offset = Math.max(0, offset);
    }

    let dragging = false;
    let dragFill: boolean;
    let dragKey: string;
    let dragStart: number;

    function onClick(index: number, key: string) {
        if($currentFrame > index) tools.goBackToFrame(index);
        dragFill = !frames[index][key];
        frames[index][key] = dragFill;
        dragStart = index;
        dragKey = key;
        dragging = true;
    }

    function onMouseover(index: number) {
        if(!dragging) return;
        if($currentFrame > index) tools.goBackToFrame(index);

        let delta = dragStart < index ? 1 : -1;
        for(let i = dragStart; i !== index + delta; i += delta) {
            frames[i][dragKey] = dragFill;
        }
    }

    let draggingMovement = false;
    let draggingMovementStart: number;
    let draggingMovementAngle: number;
    let draggingMovementEnd: number;

    function onArrowClick(index: number) {
        draggingMovement = true;
        draggingMovementStart = index;
        draggingMovementAngle = frames[index].angle;
        draggingMovementEnd = index;
    }

    function onAngleMouseover(index: number) {
        if(!draggingMovement) return;

        if($currentFrame > index) tools.goBackToFrame(index);
        draggingMovementEnd = index;

        // copy the start frame
        let delta = draggingMovementStart < index ? 1 : -1;
        for(let i = draggingMovementStart; i !== index + delta; i += delta) {
            frames[i].angle = draggingMovementAngle;
        }
    }

    let pickingAngle = false;

    function updateAngle(index: number) {
        pickingAngle = true;
        if($currentFrame > index) tools.goBackToFrame(index);

        showAnglePicker(frames[index].angle)
            .then((angle) => {
                pickingAngle = false;
                frames[index].angle = angle
            });
    }

    let playing = false;

    function onKeydown(e: KeyboardEvent) {
        if(playing || pickingAngle) return;
        
        // move forward or backward
        if(e.key === "ArrowRight") {
            if(e.shiftKey) for(let i = 0; i < 5; i++) tools.advanceFrame();
            else tools.advanceFrame();
        } else if(e.key === "ArrowLeft") {
            if(e.shiftKey) tools.goBackToFrame(Math.max(0, $currentFrame - 5));
            else if($currentFrame >= 1) tools.backFrame();
        }
    }

    function keepActiveVisible() {
        if($currentFrame - 2 < offset) offset = Math.max(0, $currentFrame - 2);
        if($currentFrame + 3 > offset + rows) offset = $currentFrame - rows + 3;
    }

    currentFrame.subscribe(keepActiveVisible);

    function togglePlaying() {
        if(pickingAngle) return;
        playing = !playing;
        if(playing) tools.startPlayback();
        else tools.stopPlayback();
    }

    function toggleBlockingAction(index: number, key: "answer" | "purchase") {
        if($currentFrame > index) tools.goBackToFrame(index);
        frames[index][key] = !frames[index][key];

        // turn off disabled things other stuff
        if(key === "answer") frames[index].moving = false;
        if(key === "answer") frames[index].purchase = false;
        else frames[index].answer = false;

        if(frames[index + 1]) {
            if(key === "answer") frames[index + 1].moving = false;
            frames[index + 1].answer = false;
            frames[index + 1].purchase = false;
        }

        if(frames[index + 2]) {
            frames[index + 2].answer = false;
            frames[index + 2].purchase = false;
        }
    }
</script>

<svelte:window bind:innerHeight={height} on:pointerup={() => dragging = false}
on:pointerup={() => draggingMovement = false} on:keydown={onKeydown} />

<div class="UI" on:wheel={onScroll}>
    <div class="controls">
        <button on:click={() => tools.backFrame()}>
            &larr;
        </button>
        <button on:click={togglePlaying}>
            {playing ? "⏹" : "▶"}
        </button>
        <button on:click={() => tools.advanceFrame()}>
            &rarr;
        </button>
        <button on:click={() => tools.download()}>
            &#11123;
        </button>
        <button on:click={() => tools.load()}>
            &#11121;
        </button>
    </div>
    <table>
        <tr>
            <th>Frame #</th>
            <th>Answer</th>
            <th>Purchase</th>
            <th>Move</th>
            <th>Angle</th>
        </tr>
        {#each { length: rows } as _, i}
            {@const index = offset + i}

            {@const answerDisabled = frames[index].purchase || frames[index - 1]?.answer || frames[index - 2]?.answer
                || frames[index - 1]?.purchase || frames[index - 2]?.purchase}

            {@const purchaseDisabled = frames[index].answer || frames[index - 1]?.answer || frames[index - 2]?.answer
                || frames[index - 1]?.purchase || frames[index - 2]?.purchase}
                
            {@const moveDisabled = frames[index].answer || frames[index - 1]?.answer}

            <tr on:pointerover={() => onAngleMouseover(index)} on:pointerover={() => onMouseover(index)}
            class:active={$currentFrame === index}>
                <td class="frame">{ index }</td>
                <td on:mousedown={() => answerDisabled || toggleBlockingAction(index, "answer")}>
                    <input type="checkbox" on:click|preventDefault bind:checked={frames[index].answer}
                    class:disabled={answerDisabled}/>
                </td>
                <td on:mousedown={() => purchaseDisabled || toggleBlockingAction(index, "purchase")}>
                    <input type="checkbox" on:click|preventDefault bind:checked={frames[index].purchase}
                    class:disabled={purchaseDisabled}/>
                </td>
                <td on:mousedown={() => moveDisabled || onClick(index, 'moving')}>
                    <input type="checkbox" on:click|preventDefault bind:checked={frames[index].moving}
                    class:disabled={moveDisabled} />
                </td>
                <td class="angle" class:dragged={draggingMovement && between(index, draggingMovementStart, draggingMovementEnd)}>
                    <div class="number" on:pointerdown={() => updateAngle(index)}>
                        <div style="transform: rotate({frames[index].angle + 90}deg);">
                            &uArr;
                        </div>
                        {Math.round(frames[index].angle * 100) / 100}°
                    </div>
                    <div class="drag" on:pointerdown={() => onArrowClick(index)}>
                        &updownarrow;
                    </div>
                </td>
            </tr>
        {/each}
    </table>
</div>

<style>
    .UI {
        position: absolute;
        background-color: rgba(255, 255, 255, 0.6);
        top: 0;
        left: 0;
        height: 100%;
        z-index: 9999999;
    }

    .controls {
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 5px;
    }

    table {
        min-width: 100%;
    }

    tr {
        height: 22px;
    }

    td.dragged {
        background-color: rgba(0, 138, 197, 0.5) !important;
    }

    tr.active {
        background-color: rgba(0, 138, 197, 0.892) !important;
    }

    tr:nth-child(even) {
        background-color: rgba(0, 0, 0, 0.1);
    }

    th:first-child, td:first-child {
        width: 100px;
    }

    input[type="checkbox"].disabled, input[type="checkbox"]:disabled {
        opacity: 0.5;
    }

    th, td {
        height: 22px;
        width: 60px;
        text-align: center;
        user-select: none;
    }

    .angle {
        width: 130px;
        padding: 0 10px;
        display: flex;
        align-items: center;
        gap: 5px;
        cursor: pointer;
    }

    .angle .number {
        flex-grow: 1;
        display: flex;
        align-items: center;
        gap: 5px;
    }

    .drag {
        cursor: ns-resize;
    }
</style>