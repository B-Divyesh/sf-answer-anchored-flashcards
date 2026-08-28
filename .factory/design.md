# Recall Anchor visual thesis

## Direction

Recall Anchor looks like a compact recall worksheet printed on warm stock. A dithered/halftone print system turns each answer into a visible mark: question, evidence, rubric, next date. This fits a product about concrete proof better than glossy software chrome. Misregistration, crop marks, ruled lines, and punched corners make the review trail feel inspected rather than guessed.

## Tokens

- Paper `#f4eddd`; raised paper `#fffaf0`; ink `#18263d`; muted ink `#5d625f`.
- Vermilion `#d9432f` is the answer/action mark; its dark treatment is `#a72d20`.
- Mustard `#e9b949` marks intervals; green `#16745b` marks a passed rubric; danger `#a92b36`.
- Dark mode uses ink `#101827`, paper `#192438`, raised paper `#202f47`, and soft type `#f6eedf`.
- Spacing follows 4/8 px: 4, 8, 12, 16, 24, 32, 48, 72, 96.
- Borders are 2 px ink rules. Corners use a clipped 12 px paper notch, not generic rounded cards.

## Type

The display face is Georgia, chosen for the editorial weight of printed study guides. The body face is the local system sans stack for fast, legible utility work. No web font is downloaded. Numbers use tabular figures. Display text is dense; instructions keep a 62-character measure.

## Layout and interaction grammar

The landing screen is an asymmetric two-column broadsheet. The product preview overlaps a numbered answer strip instead of using feature cards. Forms resemble ruled worksheets. Primary buttons are solid ink rectangles with a vermilion offset shadow. Links remain underlined. Selected options receive both a check mark and color.

Review moves down a single evidence column: prompt → answer → rubric → interval. The score reveal slides from beneath the answer sheet over 220 ms. Route changes fade over 160 ms. Under reduced motion, both changes are immediate opacity swaps. Nothing loops or flashes.

## Original asset plan and provenance

The hero illustration is a model-generated still-life of three flashcard answer slips, halftone dots, registration marks, and a small brass interval dial. It contains no required text. Source candidates live in `assets/src/`; optimized WebP and social crops live in `public/assets/`.

Prompt sheet: “editorial still life of stacked study answer slips becoming a measured timeline, mid-century educational print, coarse CMYK halftone dots, imperfect ink registration, warm ivory paper, deep navy ink, vermilion red and mustard yellow marks, small brass interval dial, hard side light, top-down 50mm lens, tactile paper fibers, no people, no hands, no readable text, no letters, no logos, no watermark, no gradients, no glossy 3D UI.”

Generated with the factory image model (`factory-image`) on 2026-08-28. The output is original for Recall Anchor. UI icons are hand-authored SVG and CSS shapes under the repository MIT license.

## Responsive and theme policy

At 390 px, the proof sheet follows the hero copy and decorative crop marks disappear. Review controls stay in document order and all targets remain at least 44 px. The default follows the device theme. Both modes retain the paper/ink premise and meet 4.5:1 text contrast.
