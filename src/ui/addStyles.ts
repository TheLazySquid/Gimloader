let styles: Map<string, HTMLStyleElement[]> = new Map();

export async function addStyles(id: string, styleString: string) {
    let style = document.createElement('style');
    style.innerHTML = styleString;

    // wait for document to be ready
    if(!document.head) await new Promise(res => document.addEventListener('DOMContentLoaded', res, { once: true }));
    document.head.appendChild(style);

    // add to map
    if(!styles.has(id)) styles.set(id, []);
    styles.get(id)?.push(style);
}

export function removeStyles(id: string) {
    if(!styles.has(id)) return;

    for(let style of styles.get(id)!) {
        style.remove();
    }

    styles.delete(id);
}