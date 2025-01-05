export function log(...args: any[]) {
    console.log('%c[GL]', 'color:#5030f2', ...args);
}

export function error(...args: any[]) {
    console.error('%c[GL]', 'color:#5030f2', ...args);
}

export const validate = (fnName: string, args: IArguments, ...schema: [string, string][]) => {
    for(let i = 0; i < schema.length; i++) {
        let [ name, type ] = schema[i];
        if(args[i] === undefined) {
            error(fnName, 'called without argument', name)
            return false;
        }
        if(typeof args[i] !== type) {
            error(fnName, 'recieved', args[i], `for argument ${name}, expected type ${type}`);
            return false;
        }
    }

    return true;
}

export const onGimkit = location.host === "www.gimkit.com";