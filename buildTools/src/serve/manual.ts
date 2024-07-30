import rl from 'readline';

export default function waitForEnter(callback: () => void, message: string) {
    rl.emitKeypressEvents(process.stdin);
    
    if(process.stdin.isTTY) {
        process.stdin.setRawMode(true);
    }
    
    // console.log("Press Enter to rebuild, and press Ctrl+C to exit");
    // process.stdout.write("Press enter to build...");
    process.stdout.write(message);
    
    process.stdin.on('keypress', async (_, key) => {
        if(key.ctrl && key.name === 'c') {
            process.exit(0);
        } else if(key.name === 'return') {
            // build the plugin
            callback();
        }
    })
}