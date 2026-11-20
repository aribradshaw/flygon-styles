// The four Flygon themes: Flygon LC, Othello, System Boring and Night.
// Canonical copy. Change palettes here, then run `npm run build`.
export const othelloPalette = {
  gray: ['#FAF9F7', '#F2F1EE', '#E4E3DE', '#CECEC7', '#A9AAA3', '#858780', '#666962', '#4F534D', '#393E39', '#272D29', '#181E1B'],
  blue: ['#F3F7FA', '#E5EEF4', '#CCDDE9', '#A7C4D8', '#7FA5C1', '#5D89AB', '#456E90', '#365874', '#2E495F', '#293E50', '#1A2936'],
};
export const shadeSteps = [50,100,200,300,400,500,600,700,800,900,950];
export const styleRules = [
  ['No eyebrows', 'Start with the heading. No tiny uppercase category labels floating above it. Useful status labels belong beside the thing they describe.'],
  ['No skeletons', 'Keep existing content during refresh. For a first load, use a short, honest status message. No shimmering fake layouts or artificial delays.'],
  ['Content before containers', 'Use spacing and typography first. No default three-card grids, nested boxes, equal-height filler, or an icon on every paragraph.'],
  ['No decorative AI tropes', 'No gradient blobs, sparkle icons, orbiting shapes, glass everywhere, or random accent words. Materials need a specific purpose.'],
  ['Write like a person', 'Use concrete verbs and short sentences. No “unlock,” “seamless,” “elevate,” filler introductions, invented metrics, or em dashes.'],
  ['Make controls honest', 'Every control must work. Show validation and actionable errors. Label examples as examples; never present sample numbers as live business data.'],
  ['Make it readable', 'Body text starts at 16px. Keep readable numerals, visible keyboard focus, text contrast of at least 4.5:1, and touch targets of at least 44px.'],
  ['Motion explains changes', 'Animate real state, not decoration. Use short transitions, honor reduced motion, and prevent layout shifts when dialogs or loading states appear.'],
];
export const styles = [
  { id: 'flygon', name: 'Flygon LC', description: 'Pixel character. Warm green. A little red, used deliberately.', heading: 'Small team.\nReal work.', body: 'Distinctive enough to remember. Simple enough to use every day.', font: 'Press Start 2P + system sans', headingFont: '"Press Start 2P", monospace', bodyFont: 'system-ui, sans-serif', radius: '4px', colors: {paper:'#F4F6EE',surface:'#FFFFFF',ink:'#1D2A1F',muted:'#4A5A4C',accent:'#A8524C',onAccent:'#FFFFFF',line:'#D3DCC9'},
    principles: ['Keep pixel type for short headlines and brand moments. Use a plain sans for forms, long copy, and money.', 'Use warm paper as the field, dark green as ink, light green for panel offsets, and brick red for the primary action.', 'Square edges and a small hard shadow suit the pixel vocabulary. Avoid a game UI full of ornamental chrome.'],
    source: 'Flygon LC: src/pages/Home/Home.css and src/App.css. Original green/red values and Press Start 2P are retained. The existing darker green #263A28 is used for readable small text on light green.' },
  { id: 'othello', name: 'Othello', description: 'Quiet Harbor blue, warm Hearth neutrals, and spacious editorial type.', heading: 'More life.\nTogether.', body: 'Clear guidance, thoughtful details, and room for the things that matter.', font: 'Source Sans 3 + Georgia italic', headingFont: '"Style Source Sans", sans-serif', bodyFont: '"Style Source Sans", sans-serif', radius: '24px', colors: {paper:'#F3F7FA',surface:'#E5EEF4',ink:'#293E50',muted:'#365874',accent:'#365874',onAccent:'#FFFFFF',line:'#A7C4D8'},
    principles: ['Home: light, tightly tracked Source Sans 3 headings, one meaningful Georgia italic word, asymmetric composition, and pill actions.', 'About: alternate light Harbor surfaces with deep-blue editorial moments. Use subtle material only when it creates a real layer.', 'Use one shared outer frame: 1320px content, with 16px / 32px / 60px gutters. Preserve authored pet photography and custom modules, not generic icon cards.'],
    source: 'Direct palette import: othello-pet/ari-portal/src/lib/othello-palette.ts. Rules: docs/design/othello-style-guide.md. Home: othello-hero.css. About: about-harbor.css. Frame: marketing-site.css. Snapshot: 2026-10-04, HEAD f294a9c.' },
  { id: 'system', name: 'System Boring', description: 'GeneaRoute’s paper-and-forest system. Quiet, legible, and dependable.', heading: 'Clarity is\nthe feature.', body: 'A familiar layout. Plain labels. The right information, where you expect it.', font: 'Instrument Serif + Instrument Sans', headingFont: '"Instrument Serif", Georgia, serif', bodyFont: '"Instrument Sans", system-ui, sans-serif', radius: '3px', colors: {paper:'#F7F7F4',surface:'#FFFFFF',ink:'#181B19',muted:'#606662',accent:'#155747',onAccent:'#FFFFFF',line:'#D9DDDA'},
    principles: ['Use GeneaRoute’s Instrument Serif for editorial headings and Instrument Sans for the working interface. Keep numeric data in the sans.', 'Retain warm paper, forest actions, mint feedback, 3px buttons, and fine dividers. Let lists be lists instead of turning everything into cards.', 'Adapt the 1180px reading frame and restrained 160ms transitions. Do not inherit its eyebrow or skeleton patterns.'],
    source: 'GeneaRoute: Genealogy/src/app/globals.css. Exact paper, ink, forest, line, and muted colors; Instrument type pairing; 3px button radius. Snapshot: 2026-10-04, HEAD e34635c.' },
  { id: 'night', name: 'Night', description: 'Quiet dark restraint with large, comfortable touch targets.', heading: 'Less glare.\nMore focus.', body: 'A calm workspace after dark. Content leads; controls stay out of the way.', font: 'System UI + system monospace', headingFont: 'system-ui, sans-serif', bodyFont: 'system-ui, sans-serif', radius: '16px', colors: {paper:'#151719',surface:'#222529',ink:'#F1F3F4',muted:'#BBC1C7',accent:'#B7D9AE',onAccent:'#172414',line:'#42474D'},
    principles: ['Use charcoal, not pure black, for the main canvas. Separate surfaces with a small tonal step, not glows.', 'Keep one muted accent for the current action. Use touch targets of at least 44px and explicit text labels.', 'Prefer system typography and monospace only for code. This is an original Flygon direction.'],
    source: 'Original Flygon-owned direction. No third-party assets or palettes.' },
];
export function cssForStyle(style) {
  const semantic = Object.entries(style.colors).map(([key,value]) => `  --style-${key}: ${value};`);
  const ramps = style.id === 'othello' ? Object.entries(othelloPalette).flatMap(([family, colors]) => colors.map((value,index) => `  --othello-${family}-${shadeSteps[index]}: ${value};`)) : [];
  return `/* ${style.name}. Scope to your component, not the whole app. */\n.style-${style.id} {\n${[...semantic,...ramps,`  --style-radius: ${style.radius};`,`  --style-heading-font: ${style.headingFont};`,`  --style-body-font: ${style.bodyFont};`].join('\n')}\n}`;
}
