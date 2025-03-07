export function generateGameCode() {
    let number = random(10000, 999999);
    return number.toString();
}

export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}