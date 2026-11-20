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
npm install https://github.com/aribradshaw/flygon-styles/releases/download/v1.0.2/flygon-styles-1.0.2.tgz
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

JavaScript catalog (names, colors, principles, the eight style rules):

```js
import { styles, styleRules, othelloPalette, cssForStyle } from '@flygon/styles';
```

Plain JSON for non-JS tools: `@flygon/styles/tokens.json`.

Fonts are not bundled. Load Press Start 2P, Source Sans 3 or Instrument Serif/Sans where a theme needs them.

## Change a theme

Edit `src/catalog.js`, then:

```sh
npm run build   # regenerates dist/
npm test        # four themes, same color roles, dist up to date, 4.5:1 text contrast
```

Commit `dist/` with the change, tag the release, attach `npm pack` output with `gh release upload`, and bump the URL in each app.

## Versioning

[Bradshaw Versioning](https://github.com/aribradshaw/devlog/blob/main/docs/bradshaw-versioning.md): `YEAR.MONTH.UPDATE`, one-based year from 2026, months relative to the project's start (November 2026 is month `0`). Pin an exact tag.
