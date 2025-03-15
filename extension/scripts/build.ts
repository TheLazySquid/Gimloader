import fs from 'fs';

// firefox or chrome
let type = process.argv[2];

if(!fs.existsSync("./build")) fs.mkdirSync("./build");

if(!fs.existsSync("./build/images")) {
    fs.cpSync('./images', './build/images', { recursive: true });
}
fs.copyFileSync('./edit_csp.json', './build/edit_csp.json');
fs.copyFileSync('./popup.html', './build/popup.html');

let manifest: any;
if(type === "firefox") {
    manifest = JSON.parse(fs.readFileSync('./manifest.firefox.json').toString());
} else {
    manifest = JSON.parse(fs.readFileSync('./manifest.chrome.json').toString());
}

let pkg = JSON.parse(fs.readFileSync('../package.json').toString());
manifest.version = pkg.version;

fs.writeFileSync('./build/manifest.json', JSON.stringify(manifest, null, 4));

// remove js/relay when not on firefox
if(type !== "firefox") {
    if(fs.existsSync("./build/js/relay")) {
        fs.rmSync("./build/js/relay", { recursive: true });
    }
}