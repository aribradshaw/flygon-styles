import { flygonBrand, othelloPalette, shadeSteps, styles } from './catalog.js';

const kebab = key => key.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);

function declarations(style) {
  const semantic = Object.entries(style.colors).map(([key, value]) => `  --style-${key}: ${value};`);
  const ramps = style.id === 'othello'
    ? Object.entries(othelloPalette).flatMap(([family, colors]) => colors.map((value, index) => `  --othello-${family}-${shadeSteps[index]}: ${value};`))
    : [];
  const scheme = style.id === 'night' ? 'dark' : 'light';
  return [...semantic, ...ramps, `  --style-radius: ${style.radius};`, `  --style-heading-font: ${style.headingFont};`, `  --style-body-font: ${style.bodyFont};`, `  color-scheme: ${scheme};`].join('\n');
}

// One block per theme. Apply with data-theme="<id>" on any element, or the .style-<id> class.
export function themesCss() {
  const blocks = styles.map(style => `/* ${style.name} */\n[data-theme="${style.id}"],\n.style-${style.id} {\n${declarations(style)}\n}`);
  const brand = `/* Flygon brand colors, available on every page */\n:root {\n${Object.entries(flygonBrand).map(([key, value]) => `  --flygon-${kebab(key)}: ${value};`).join('\n')}\n}`;
  return `/* @flygon/styles. Generated from src/catalog.js by npm run build. Do not edit. */\n${[brand, ...blocks].join('\n\n')}\n`;
}

export function tokens() {
  return {
    themes: Object.fromEntries(styles.map(({ id, name, colors, radius, headingFont, bodyFont }) => [id, { name, colors, radius, headingFont, bodyFont }])),
    flygonBrand,
    othelloPalette,
    shadeSteps,
  };
}
