#!/usr/bin/env node
// The Othello theme follows the Othello site. Its ramps live in the Othello
// repo (ari-portal/src/lib/othello-palette.ts); this keeps our copy in step.
//
//   npm run othello:check [-- --from ../othello-pet]   exit 1 if the ramps differ
//   npm run othello:pull  [-- --from ../othello-pet]   copy the site's ramps here and rebuild dist
//
// The theme's semantic colors are shades of the blue ramp (see src/catalog.js),
// so pulling the ramps updates them too.
import { execFileSync } from 'node:child_process';
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { othelloPalette } from '../src/catalog.js';

const [mode = 'check', ...rest] = process.argv.slice(2);
const fromIndex = rest.indexOf('--from');
const root = fileURLToPath(new URL('..', import.meta.url));
const repo = resolve(root, fromIndex === -1 ? (process.env.OTHELLO_REPO || '../othello-pet') : rest[fromIndex + 1]);
const source = resolve(repo, 'ari-portal/src/lib/othello-palette.ts');
if (!existsSync(source)) throw new Error(`Othello palette not found at ${source}. Pass --from <othello-pet checkout>.`);

const text = readFileSync(source, 'utf8');
const site = {};
for (const family of Object.keys(othelloPalette)) {
  const match = text.match(new RegExp(`${family}:\\s*\\{[\\s\\S]*?shades:\\s*\\[([^\\]]+)\\]`));
  if (!match) throw new Error(`No ${family} ramp in ${source}`);
  site[family] = match[1].match(/#[0-9A-Fa-f]{6}/g).map(hex => hex.toUpperCase());
  if (site[family].length !== othelloPalette[family].length) throw new Error(`${family} ramp has ${site[family].length} shades, expected ${othelloPalette[family].length}`);
}

const drift = Object.keys(site).flatMap(family => site[family]
  .map((hex, index) => [family, index, othelloPalette[family][index].toUpperCase(), hex])
  .filter(([, , ours, theirs]) => ours !== theirs));

if (!drift.length) {
  console.log('Othello ramps match the Othello site.');
  process.exit(0);
}
for (const [family, index, ours, theirs] of drift) console.log(`${family}[${index}]: ${ours} here, ${theirs} on the site`);
if (mode !== 'pull') {
  console.log('Run npm run othello:pull to take the site\'s values.');
  process.exit(1);
}

const catalogPath = resolve(root, 'src/catalog.js');
let catalog = readFileSync(catalogPath, 'utf8');
for (const family of Object.keys(site)) {
  const pattern = new RegExp(`(\\n  ${family}: \\[)[^\\]]*(\\])`);
  if (!pattern.test(catalog)) throw new Error(`Could not find the ${family} ramp in src/catalog.js`);
  catalog = catalog.replace(pattern, `$1${site[family].map(hex => `'${hex}'`).join(', ')}$2`);
}
writeFileSync(catalogPath, catalog);
execFileSync(process.execPath, ['scripts/build.mjs'], { cwd: root, stdio: 'inherit' });
console.log('Pulled the Othello ramps. Run npm test, commit, release, then npm run bump-consumers.');
