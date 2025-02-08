import Popup from "./Popup.svelte";
import { mount } from "svelte";
import styles from './styles.scss';
import state from '$shared/bareState.svelte';

state.init();

let style = document.createElement("style");
style.innerHTML = styles;
document.head.appendChild(style);

mount(Popup, {
    target: document.body
});