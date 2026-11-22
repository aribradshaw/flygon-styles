import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { styles, themesCss, tokens } from '../src/index.js';

test('ships exactly the four themes', () => {
  assert.deepEqual(styles.map(s => s.id), ['flygon', 'othello', 'system', 'night']);
});

test('every theme defines the same color roles', () => {
  const roles = Object.keys(styles[0].colors).sort();
  for (const style of styles) assert.deepEqual(Object.keys(style.colors).sort(), roles, style.id);
});

test('committed dist matches the catalog (run npm run build)', async () => {
  assert.equal(await readFile(new URL('../dist/themes.css', import.meta.url), 'utf8'), themesCss());
  assert.deepEqual(JSON.parse(await readFile(new URL('../dist/tokens.json', import.meta.url), 'utf8')), tokens());
});

function luminance(hex) {
  const [r, g, b] = hex.match(/[0-9a-f]{2}/gi).map(h => parseInt(h, 16) / 255).map(c => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
const contrast = (a, b) => { const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x); return (hi + 0.05) / (lo + 0.05); };

test('text roles meet 4.5:1 on their backgrounds', () => {
  for (const { id, colors } of styles) {
    for (const [fg, bg] of [['ink', 'paper'], ['ink', 'surface'], ['muted', 'paper'], ['muted', 'surface'], ['onAccent', 'accent']]) {
      assert.ok(contrast(colors[fg], colors[bg]) >= 4.5, `${id}: ${fg} on ${bg} is ${contrast(colors[fg], colors[bg]).toFixed(2)}:1`);
    }
  }
});

test('components.css is built and gives every theme its own select and menu', async () => {
  const { componentsCss } = await import('../src/index.js');
  const css = componentsCss();
  assert.equal(await readFile(new URL('../dist/components.css', import.meta.url), 'utf8'), css);
  for (const id of styles.map(s => s.id)) {
    assert.ok(css.includes(`:where([data-theme="${id}"]) .flygon-select`), id);
    assert.ok(css.includes(`.style-${id} .flygon-menu`), id);
  }
});
