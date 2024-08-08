import { decompress, compress } from 'compress-json';
import fs from 'fs';

let res = await fetch('https://www.gimkit.com/assets/map/characters/spine/default_gray.json');
let json = await res.json();

let decompressed = decompress(json);
decompressed.skins[1].name = "customSkin";
fs.writeFileSync('assets/gim_json_raw.txt', JSON.stringify(decompressed));

let compressed = compress(decompressed);
fs.writeFileSync('assets/gim_json.txt', JSON.stringify(compressed));