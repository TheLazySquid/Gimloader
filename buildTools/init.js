import fs from 'fs';
import { join } from 'path';

export default function init() {
    const configPath = join(process.cwd(), 'GL.config.js');
    if (fs.existsSync(configPath)) {
        console.error('GL.config.js already exists!');
        return;
    }
    
    fs.writeFileSync(configPath, `export default {
    input: "",
    name: "My Plugin",
    description: "Placeholder",
    author: "Placeholder",
    plugins: []
}`)
}
