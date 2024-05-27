export default function parseHeader(code: string) {
    let headers: Record<string, string> = {
        name: "Unnamed Plugin",
        description: "No description provided",
        author: "Unknown Author",
        version: null,
        reloadRequired: "false",
        downloadUrl: null
    };

    // parse headers for gimhook mods
    if(code.startsWith("// gimhook: ")) {
        try {
            let gimhookHeader = JSON.parse(code.slice(11, code.indexOf('\n')).trim());
            
            if(gimhookHeader.name) headers.name = gimhookHeader.name;
            if(gimhookHeader.description) headers.description = gimhookHeader.description;
            if(gimhookHeader.author) headers.author = gimhookHeader.author;
            if(gimhookHeader.version) headers.version = gimhookHeader.version;
        } catch(e) {}

        return headers;
    }
    
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
        let chunk = text.slice(validAtIndexes[i] + 1, validAtIndexes[i + 1] || text.length);
        let key = chunk.slice(0, chunk.indexOf(' ') || chunk.length);
        let value = chunk.slice(key.length).trim();

        headers[key] = value;
    }

    return headers;
}