// Writes dist/themes.css and dist/tokens.json from src/catalog.js.
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { themesCss, tokens } from '../src/render.js';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
await mkdir(dist, { recursive: true });
await writeFile(new URL('themes.css', `file://${dist}`), themesCss());
await writeFile(new URL('tokens.json', `file://${dist}`), `${JSON.stringify(tokens(), null, 2)}\n`);
console.log('Wrote dist/themes.css and dist/tokens.json');
