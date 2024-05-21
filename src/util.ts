// gotta have pretty console.logs
export function log(...args: any[]) {
    console.log('%c[GL]', 'color:#5030f2', ...args);
}