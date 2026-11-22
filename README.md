# @flygon/styles

The four Flygon themes in one place, so every app inherits them instead of copying them:

| id | Name | Feel |
|---|---|---|
| `flygon` | Flygon LC | Pixel headlines, warm paper, dark green ink, brick red action |
| `othello` | Othello | Harbor blue, warm Hearth neutrals, editorial type |
| `system` | System Boring | GeneaRoute's paper and forest. Quiet and legible |
| `night` | Night | Charcoal dark mode with large touch targets |

## Install

Install the tarball attached to a GitHub release. No npm login, and builds need no git access:

```sh
npm install https://github.com/aribradshaw/flygon-styles/releases/download/v1.0.7/flygon-styles-1.0.7.tgz
```

## Use

CSS variables, scoped by attribute or class:

```js
import '@flygon/styles/themes.css';
```

```html
<html data-theme="night">   <!-- or class="style-night" on any element -->
```

Each theme sets `--style-paper`, `--style-surface`, `--style-ink`, `--style-muted`, `--style-accent`, `--style-on-accent`, `--style-line`, `--style-radius`, `--style-heading-font`, `--style-body-font` and `color-scheme`. Othello also sets its full ramps (`--othello-gray-50` … `--othello-blue-950`).

Flygon brand colors (logo and product chrome) are always on `:root`: `--flygon-green`, `--flygon-dark`, `--flygon-light`, `--flygon-tint`, `--flygon-brick`, `--flygon-brick-hover`.

Shared controls, styled for each theme (load after `themes.css`, inside an element with `data-theme`):

```js
import '@flygon/styles/components.css';
```

```html
<span class="flygon-select"><select>…</select></span>

<!-- Custom list: same look, and the open list is themed too (you add the ARIA combobox behavior) -->
<span class="flygon-select is-open">
  <button class="flygon-select-button" role="combobox" aria-expanded="true"><span class="flygon-select-value">Night</span></button>
  <div class="flygon-menu" role="listbox"><div class="flygon-menu-item" role="option" aria-selected="true">Night</div></div>
</span>

<div class="flygon-menu" role="menu">
  <p class="flygon-menu-label">Theme</p>
  <button class="flygon-menu-item" role="menuitemradio" aria-checked="true">Night</button>
  <hr class="flygon-menu-separator">
  <a class="flygon-menu-item" role="menuitem" href="/settings">Settings</a>
</div>
```

Flygon LC draws them pixel-hard (2px dark border, offset shadow), Othello soft and round, System Boring flat and compact, Night roomy with 48px+ targets. The menu is unpositioned; place it yourself. It eases in when it appears, and motion turns off under `prefers-reduced-motion`.

JavaScript catalog (names, colors, principles, the eight style rules, `flygonBrand`):

```js
import { styles, styleRules, othelloPalette, cssForStyle } from '@flygon/styles';
```

Plain JSON for non-JS tools: `@flygon/styles/tokens.json`. `componentsCss()` returns the components stylesheet as a string.

Fonts are not bundled. Load Press Start 2P, Source Sans 3 or Instrument Serif/Sans where a theme needs them.

## Change a theme

Edit `src/catalog.js`, then:

```sh
npm run build   # regenerates dist/
npm test        # four themes, same color roles, dist up to date, 4.5:1 text contrast
```

Commit `dist/` with the change, tag the release, attach `npm pack` output with `gh release upload`, then open bump PRs in every app:

```sh
npm run bump-consumers -- --dry-run   # list apps on an older version
npm run bump-consumers                # one PR per app, on chore/flygon-styles-<version>
```

It finds apps by scanning every repo's `package.json` files for the release URL, rewrites the URL, refreshes the lockfile, and runs the app's `styles:after-bump` script if it has one (for regenerating committed output). Options: `--version X.Y.Z`, `--repo <name>`, `--owner <login>`.

## Where each theme comes from

- **Othello** follows the Othello site. Its ramps are owned by `othello-pet` (`ari-portal/src/lib/othello-palette.ts`), and the theme's colors are shades of those ramps. Don't edit them here: change the site, then `npm run othello:pull -- --from <othello-pet checkout>` (or `othello:check` to see drift).
- **System Boring** started as GeneaRoute's palette; GeneaRoute now reads its base colors from this package.
- **Flygon LC** and **Night** are designed here.

## Versioning

[Bradshaw Versioning](https://github.com/aribradshaw/devlog/blob/main/docs/bradshaw-versioning.md): `YEAR.MONTH.UPDATE`, one-based year from 2026, months relative to the project's start (November 2026 is month `0`). Pin an exact tag.

## License

All rights reserved by Flygon LC. Public so Flygon projects can install it, not for reuse. Flygon LC and its affiliated companies may use it; copies of Flygon's open-source software (such as Flow) may use it as shipped in that software. See [LICENSE](LICENSE).
