import fs from 'fs';

// firefox or chrome
let type = process.argv[2];

if(!fs.existsSync("./build")) fs.mkdirSync("./build");

fs.cpSync('./images', './build/images', { recursive: true });
fs.copyFileSync('./edit_csp.json', './build/edit_csp.json');
fs.copyFileSync('./popup.html', './build/popup.html');

if(type === "firefox") {
    fs.copyFileSync('./manifest.firefox.json', './build/manifest.json');
} else {
    fs.copyFileSync('./manifest.chrome.json', './build/manifest.json');
}