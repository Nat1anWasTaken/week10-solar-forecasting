# Slidev Google-inspired starter

A deck-local Slidev theme with a clean Google-style visual language: Google
blue, Google Sans, generous white space, quiet neutrals, and restrained
four-color accents.

## Run the deck

```bash
pnpm install
pnpm run dev
```

Open <http://localhost:3030>. Build or export with:

```bash
pnpm run build
pnpm exec slidev export slides.md --output week10-a-2.pdf
pnpm exec slidev export slides.md --format png --output week10-a-2
```

## Use the theme

The deck selects the local theme in its headmatter:

```yaml
---
theme: ./theme
colorSchema: light
aspectRatio: 16/9
canvasWidth: 980
---
```

The theme styles Slidev's standard layouts and adds Markdown-first layouts.
Slide content stays in Markdown while layout-specific presentation is
configured through frontmatter props and named slots.

## Markdown-first layouts

| Layout | Frontmatter props | Named slots |
| --- | --- | --- |
| `cover` | `kicker`, `meta`, `background`, `topics` | — |
| `intro`, `section`, `statement`, `fact` | `kicker` | — |
| `end` | `kicker`, `meta` | — |
| `three-cards` | `cardColors`, `cardNumbers` | `card1`, `card2`, `card3` |
| `two-cols-callout` | `calloutKicker` | `left`, `right` |
| `image-left`, `image-right` | `image`, `backgroundSize`, `kicker` | `callout` |
| `code-palette` | `palette` | — |
| `figure` | `kicker`, `figureTag` | `figure`, `source` |
| `figure-side` | `kicker`, `figureTag`, `figureWidth` | `figure`, `source` |
| `flow` | `kicker`, `figureTag`, `stepColors`, `stepNumbers` | `step1`, `step2`, `step3`, `figure`, `after`, `source` |

The figure layouts put a title block above (`figure`) or beside
(`figure-side`) one illustration. `figureTag` adds a small label such as
`概念示意`, and the `source` slot renders a small citation line at the bottom.
`flow` shows three connected steps; adding a `figure` slot turns the steps
into a compact row above the figure.

For example, three cards require no HTML or utility classes:

```md
---
layout: three-cards
---

# Three ideas

::card1::

## Focus

Keep one clear message per slide.

::card2::

## Rhythm

Alternate dense and spacious layouts.

::card3::

## Finish

Close with a memorable takeaway.
```

Image layouts also expose their secondary panel as Markdown:

```md
---
layout: image-left
image: /images/example.jpg
kicker: FIELD NOTES
---

# A strong visual

Add the main explanation here.

::callout::

## Key detail

Use this optional area for a short supporting point.
```

Standard layouts such as `default`, `center`, `two-cols`, and
`two-cols-header` remain compatible.

`SingleImage` is a deck-local component for filling a default slide with one
fully visible image:

```md
---
layout: default
---

<SingleImage src="/images/example.jpg" alt="Example image" />
```

## Theme tokens

Use the CSS variables `--google-blue`, `--google-red`, `--google-yellow`,
`--google-green`, `--google-ink`, `--google-muted`, `--google-surface`,
`--google-border`, and `--google-shadow` in slide-level styles.

Google Sans is self-hosted from files served by the official Google Fonts
service, so the deck does not request fonts at runtime. See
[`theme/assets/fonts/SOURCE.md`](theme/assets/fonts/SOURCE.md) for provenance.
