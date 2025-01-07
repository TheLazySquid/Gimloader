export function log(...args: any[]) {
    console.log('%c[GL]', 'color:#5030f2', ...args);
}

export function error(...args: any[]) {
    console.error('%c[GL]', 'color:#5030f2', ...args);
}

export function validate(fnName: string, args: IArguments, ...schema: [string, string | object][]) {
    for(let i = 0; i < schema.length; i++) {
        let [ name, type ] = schema[i];
        if(args[i] === undefined) {
            error(fnName, 'called without argument', name);
            return false;
        }
        if(typeof type === "object") {
            if(typeof args[i] !== "object") {
                error(fnName, 'recieved', args[i], `for argument ${name}, expected type object`);
                return false;
            }

            for(let key in type) {
                if(args[i][key] === undefined) {
                    error(fnName, `called without argument ${name}.${key}`);
                    return false;
                }

                if(typeof args[i][key] !== type[key]) {
                    error(fnName, 'recieved', args[i][key], `for argument ${name}.${key}, expected type ${type[key]}`);
                }
            }
        } else {
            if(typeof args[i] !== type) {
                error(fnName, 'recieved', args[i], `for argument ${name}, expected type ${type}`);
                return false;
            }
        }
    }

    return true;
}

export const onGimkit = location.host === "www.gimkit.com";

export function splicer(array: any[], obj: any) {
    return () => {
        let index = array.indexOf(obj);
        if(index !== -1) array.splice(index, 1);
    }
}