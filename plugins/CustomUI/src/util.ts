import type { Theme } from "./types";

export function getBorderColor(theme: Theme) {
    // return white or black depending on the brightness of the background color
    let rgb = parseHex(theme.question.background);
    
    // magic formula to determine brightness
    let brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;

    return brightness > 128 ? "#000000" : '#ff5c61';
}

export function parseHex(hex: string) {
    return {
        r: parseInt(hex.substring(1, 3), 16),
        g: parseInt(hex.substring(3, 5), 16),
        b: parseInt(hex.substring(5, 7), 16)
    }
}