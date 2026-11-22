// Shared controls styled for all four themes. Built into dist/components.css.
// They read the theme tokens from themes.css, so load that first and put the
// controls inside an element with data-theme (or a .style-<id> class).
//
//   <span class="flygon-select"><select>…</select></span>
//
//   <div class="flygon-menu" role="menu">
//     <p class="flygon-menu-label">Theme</p>
//     <button class="flygon-menu-item" role="menuitemradio" aria-checked="true">Night</button>
//     <hr class="flygon-menu-separator">
//     <a class="flygon-menu-item" role="menuitem" href="/settings">Settings</a>
//   </div>

// [data-theme] is wrapped in :where() so a .style-<id> preview inside a themed page keeps its own look.
const themed = (id, rules) => rules.map(([selector, body]) => `:where([data-theme="${id}"]) ${selector},\n.style-${id} ${selector} {\n${body}\n}`).join('\n\n');

const base = `/* Select: wrap a native <select> in .flygon-select. The chevron is drawn in CSS and follows the text color. */
.flygon-select {
  --select-height: 44px;
  --select-border: 1px solid var(--style-line);
  --select-radius: min(var(--style-radius, 4px), 12px);
  --select-shadow: none;
  --select-hover: color-mix(in srgb, var(--style-accent) 8%, var(--style-surface));
  position: relative;
  display: inline-block;
  width: 100%;
  color: var(--style-ink);
}
.flygon-select select {
  appearance: none;
  -webkit-appearance: none;
  display: block;
  width: 100%;
  min-height: var(--select-height);
  margin: 0;
  padding: 8px 40px 8px 14px;
  border: var(--select-border);
  border-radius: var(--select-radius);
  background: var(--style-surface);
  box-shadow: var(--select-shadow);
  color: inherit;
  font: inherit;
  font-size: 15px;
  line-height: 1.3;
  cursor: pointer;
  transition: background-color 140ms, box-shadow 140ms, transform 140ms;
}
.flygon-select select:hover:not(:disabled) { background-color: var(--select-hover); }
.flygon-select select:focus-visible { outline: 3px solid var(--style-accent); outline-offset: 2px; }
.flygon-select select:disabled { opacity: .55; cursor: not-allowed; }
.flygon-select::after {
  content: "";
  position: absolute;
  top: 50%;
  right: 16px;
  width: 7px;
  height: 7px;
  border-right: 2px solid currentColor;
  border-bottom: 2px solid currentColor;
  transform: translateY(-70%) rotate(45deg);
  pointer-events: none;
}
.flygon-select option { background: var(--style-surface); color: var(--style-ink); }

/* Menu: a popover list for account menus, overflow menus and pickers. Position it yourself. */
.flygon-menu {
  --menu-radius: min(var(--style-radius, 4px), 14px);
  --menu-border: 1px solid var(--style-line);
  --menu-shadow: 0 12px 32px rgba(0, 0, 0, .16), 0 2px 6px rgba(0, 0, 0, .08);
  --menu-item-height: 40px;
  --menu-hover: color-mix(in srgb, var(--style-accent) 10%, var(--style-surface));
  display: grid;
  gap: 2px;
  min-width: 220px;
  padding: 6px;
  border: var(--menu-border);
  border-radius: var(--menu-radius);
  background: var(--style-surface);
  box-shadow: var(--menu-shadow);
  color: var(--style-ink);
  font-family: var(--style-body-font);
}
.flygon-menu-label {
  margin: 0;
  padding: 8px 10px 4px;
  color: var(--style-muted);
  font-size: 12px;
  font-weight: 600;
}
.flygon-menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  min-height: var(--menu-item-height);
  margin: 0;
  padding: 8px 10px;
  border: 0;
  border-radius: calc(var(--menu-radius) - 3px);
  background: transparent;
  color: inherit;
  font: inherit;
  font-size: 14px;
  text-align: left;
  text-decoration: none;
  cursor: pointer;
}
.flygon-menu-item:hover, .flygon-menu-item:focus-visible { background: var(--menu-hover); }
.flygon-menu-item:focus-visible { outline: 2px solid var(--style-accent); outline-offset: -2px; }
.flygon-menu-item[aria-checked]::after {
  content: "";
  width: 8px;
  height: 8px;
  margin-left: auto;
  border-radius: 50%;
  border: 2px solid var(--style-line);
}
.flygon-menu-item[aria-checked="true"]::after { border-color: var(--style-accent); background: var(--style-accent); }
.flygon-menu-separator { height: 1px; margin: 4px 6px; border: 0; background: var(--style-line); }
/* Menus ease in instead of snapping open. */
@keyframes flygon-menu-in { from { opacity: 0; transform: translateY(6px) scale(.98); } to { opacity: 1; transform: none; } }
.flygon-menu { animation: flygon-menu-in 170ms cubic-bezier(.2, .8, .2, 1) both; transform-origin: 50% 100%; }
.flygon-menu-item { transition: background-color 120ms, color 120ms; }
.flygon-menu-item[aria-checked]::after { transition: background-color 160ms, border-color 160ms, transform 160ms; }
.flygon-menu-item[aria-checked="true"]::after { transform: scale(1.1); }
@media (prefers-reduced-motion: reduce) { .flygon-select select, .flygon-menu, .flygon-menu-item, .flygon-menu-item[aria-checked]::after { transition: none; animation: none; } }`;

// Each theme's own take: pixel-hard Flygon, soft round Othello, flat System Boring, roomy Night.
const flavors = [
  themed('flygon', [
    ['.flygon-select', '  --select-height: 48px;\n  --select-border: 2px solid var(--flygon-dark, #324B34);\n  --select-radius: 2px;\n  --select-shadow: 4px 4px 0 var(--flygon-dark, #324B34);\n  --select-hover: var(--flygon-tint, #EEF7E6);'],
    ['.flygon-select select:active:not(:disabled)', '  transform: translate(2px, 2px);\n  box-shadow: 2px 2px 0 var(--flygon-dark, #324B34);'],
    ['.flygon-select::after', '  width: 8px;\n  height: 8px;\n  border-width: 0 3px 3px 0;\n  border-radius: 0;'],
    ['.flygon-menu', '  --menu-radius: 2px;\n  --menu-border: 2px solid var(--flygon-dark, #324B34);\n  --menu-shadow: 5px 5px 0 var(--flygon-dark, #324B34);\n  --menu-hover: var(--flygon-tint, #EEF7E6);'],
    ['.flygon-menu-label', '  font-family: var(--style-heading-font);\n  font-size: 9px;\n  font-weight: 400;\n  letter-spacing: 0;'],
    ['.flygon-menu-item[aria-checked]::after', '  border-radius: 0;'],
    ['.flygon-menu-item[aria-checked="true"]::after', '  border-color: var(--style-accent);\n  background: var(--style-accent);'],
  ]),
  themed('othello', [
    ['.flygon-select', '  --select-height: 46px;\n  --select-radius: 999px;\n  --select-border: 1px solid var(--othello-blue-300, #A7C4D8);\n  --select-hover: var(--othello-blue-50, #F3F7FA);'],
    ['.flygon-select select', '  padding-left: 18px;'],
    ['.flygon-select::after', '  right: 20px;\n  border-width: 0 1.5px 1.5px 0;'],
    ['.flygon-menu', '  --menu-radius: 20px;\n  --menu-border: 1px solid var(--othello-blue-200, #CCDDE9);\n  --menu-shadow: 0 18px 40px rgba(41, 62, 80, .14);\n  --menu-hover: var(--othello-blue-100, #E5EEF4);\n  padding: 8px;'],
    ['.flygon-menu-item', '  border-radius: 999px;\n  padding-inline: 14px;'],
  ]),
  themed('system', [
    ['.flygon-select', '  --select-height: 40px;\n  --select-radius: 3px;\n  --select-hover: color-mix(in srgb, var(--style-ink) 4%, var(--style-surface));'],
    ['.flygon-select select', '  font-size: 14px;'],
    ['.flygon-select::after', '  border-width: 0 1.5px 1.5px 0;\n  width: 6px;\n  height: 6px;'],
    ['.flygon-menu', '  --menu-radius: 4px;\n  --menu-shadow: 0 6px 18px rgba(24, 27, 25, .10);\n  --menu-hover: color-mix(in srgb, var(--style-ink) 5%, var(--style-surface));\n  --menu-item-height: 36px;'],
    ['.flygon-menu-item', '  border-radius: 2px;'],
  ]),
  themed('night', [
    ['.flygon-select', '  --select-height: 52px;\n  --select-radius: 12px;\n  --select-hover: color-mix(in srgb, var(--style-ink) 8%, var(--style-surface));'],
    ['.flygon-select select', '  font-size: 16px;\n  padding-left: 16px;'],
    ['.flygon-menu', '  --menu-radius: 16px;\n  --menu-shadow: 0 18px 44px rgba(0, 0, 0, .55);\n  --menu-hover: color-mix(in srgb, var(--style-ink) 9%, var(--style-surface));\n  --menu-item-height: 48px;\n  padding: 8px;'],
    ['.flygon-menu-item', '  font-size: 15px;\n  padding-inline: 12px;'],
  ]),
];

export function componentsCss() {
  return `/* @flygon/styles components. Generated from src/components.js by npm run build. Do not edit. */\n${base}\n\n${flavors.join('\n\n')}\n`;
}
