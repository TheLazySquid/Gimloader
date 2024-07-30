import { join } from 'path';
import Poller from './poller';
import { watch } from 'chokidar';
import fs from 'fs';
import { readFile } from 'fs/promises';
import parseHeader from '../parseHeader';
import waitForEnter from './manual';

export default function serveFile(args: any) {
    let poller = new Poller();

    let file = join(process.cwd(), args.file);
    if(!file.endsWith('.js')) file += '.js';
    if(!fs.existsSync(file)) {
        console.error(`File could not be found: ${file}`);
        process.exit(1);
    }

    const update = () => {
        let start = Date.now();
        process.stdout.write("\rUpdating...                 ");
        readFile(file, { encoding: 'utf-8' })
            .then((code) => {
                let headers = parseHeader(code, { isLibrary: "false" });
                poller.isLibrary = headers.isLibrary !== "false";
        
                poller.updateCode(code);
                console.log(`\rUpdated in ${Date.now() - start}ms`);
            })
            .catch((err) => {
                console.error(`Error reading file: ${err}`);
            })
            .finally(() => {
                if(args.manual) {
                    process.stdout.write("Press enter to update...");
                } else {
                    process.stdout.write("Watching file for changes...");
                }
            })
    }

    if(args.manual) {
        waitForEnter(() => {
            update();
        }, "Press Enter to update code, and press Ctrl+C to exit\n")
        update();
    } else {
        update();
        watch(file).on('change', () => {
            update();
        })
    }
}