export function random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateGameCode() {
    let number = random(10000, 999999);
    return number.toString();
}

export function randomItem<T>(array: T[]): T {
    return array[random(0, array.length - 1)];
}

export function createValuesArray<T>(): [T[], (value: T) => number] {
    let arr: T[] = [];
    let indexes = new Map<T, number>();

    const add = (value: T) => {
        if(indexes.has(value)) {
            return indexes.get(value);
        }

        arr.push(value);
        indexes.set(value, arr.length - 1);
        return arr.length - 1;
    }

    return [arr, add];
}