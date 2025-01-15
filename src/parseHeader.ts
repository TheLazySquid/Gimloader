export function parsePluginHeader(code: string) {
    const basePluginHeaders: Record<string, any> = {
        name: "Unnamed Plugin",
        description: "No description provided",
        author: "Unknown Author",
        version: null,
        reloadRequired: "false",
        isLibrary: "false",
        downloadUrl: null,
        needsLib: [],
        optionalLib: [],
        hasSettings: "false"
    };

    return parseHeader(code, basePluginHeaders);
}

export function parseLibHeader(code: string) {
    const baseLibHeaders: Record<string, any> = {
        name: 'Unnamed Library',
        author: 'Unknown Author',
        description: 'No description provided',
        version: null,
        downloadUrl: null,
        isLibrary: "false",
        reloadRequired: "false"
    }

    return parseHeader(code, baseLibHeaders);
}

export default function parseHeader(code: string, headers: Record<string, any>) {    
    // parse the JSDoc header at the start (if it exists)
    let closingIndex = code.indexOf('*/');
    if(!(code.trimStart().startsWith('/**')) || closingIndex === -1) {
        return headers;
    }

    let header = code.slice(0, closingIndex + 2);

    header = header.slice(3, -2).trim();
    let lines = header.split('\n');

    // remove the leading asterisks and trim the lines
    lines = lines.map(line => {
        let newLine = line.trimStart();
        if(newLine.startsWith('*')) {
            newLine = newLine.slice(1).trim();
        }
        return newLine;
    })

    let text = lines.join(' ');

    // go through and find all at symbols followed by non-whitespace
    // and that don't have a bracket before them if they are a link
    let validAtIndexes: number[] = [];

    let index: number = -1;
    while ((index = text.indexOf('@', index + 1)) !== -1) {
        if(text[index + 1] === ' ') continue;
        if(index != 0 && text[index - 1] === '{') {
            if(text.slice(index + 1, index + 5) === 'link') {
                continue;
            }
        }

        validAtIndexes.push(index);
    }

    for(let i = 0; i < validAtIndexes.length; i++) {
        let chunk = text.slice(validAtIndexes[i] + 1, validAtIndexes[i + 1] ?? text.length);
        let spaceIndex = chunk.indexOf(' ');
        let key = chunk.slice(0, spaceIndex !== -1 ? spaceIndex : chunk.length);
        let value = chunk.slice(key.length).trim();

        if(Array.isArray(headers[key])) {
            headers[key].push(value);
        } else {
            headers[key] = value;
        }
    }

    return headers;
}