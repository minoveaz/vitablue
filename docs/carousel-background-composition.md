# VitaBlue carousel background composition

## Supported output formats

The composition engine uses integer-native slide rasters and a gapless panorama:

| Ratio | Slide raster | Typical use |
| --- | ---: | --- |
| `1:1` | 1080 × 1080 | Feed and catalogue carousels |
| `4:5` | 1080 × 1350 | Instagram / Meta feed |
| `9:16` | 1080 × 1920 | Stories, Reels and TikTok Photo Mode |
| `16:9` | 1080 × 608 | Horizontal editorial and presentation carousels |

`panoramaWidth` is always `slideWidth × slideCount`; no fractional dimensions or
gaps are allowed. Slices use integer source rectangles, so the right edge of one
slide is exactly the left edge of the next.

## Semantic tokens

Background variants are defined in `CAROUSEL_BACKGROUND_PALETTES`:

- `white`: `background`, `primary`, `secondary`, `contrast`, `muted`
- `midnight`: the same token names with a dark surface and light content contrast
- `ocean`: the same token names with an ocean surface and midnight accents

Components should consume semantic Tailwind tokens (`primary`, `primary-dark`,
`accent`, `brand-cyan`, `background-light`) rather than introducing raw colour
values. Palette values are intentionally confined to the composition engine and
template data.

## Reusable composition presets

The background drawer exposes seven structural presets from
`CAROUSEL_BACKGROUND_PRESETS`:

- `caida-inicial` — caída inicial para el hook
- `montana-central` — pico central para un beneficio o dato
- `onda-ascendente` — progresión ascendente
- `semicirculo-entre-slides` — puente visual en los cortes
- `diagonal-dinamica` — diagonal de alto contraste
- `composicion-editorial` — lectura clara y contenida
- `cta-final` — acento de conversión en la última slide

`applyCarouselBackgroundPresetToComposition` stamps the stable `presetId`,
allows a colour variant plus `scale` and `intensity` overrides, and clears an
old custom vector path so the selected preset is visible. Safe zones, focal
points, and secondary colours are retained by default. Applying a preset
through `applyCarouselBackgroundPreset` regenerates only structural layers;
editable text, images, and other user layers remain untouched.

`presetId` is optional for backwards compatibility. Project normalization
removes unknown IDs before persistence, and serialization keeps valid IDs as
plain JSON data.

## Export rules

- PNG panorama, PNG slides in ZIP, and PDF pages are rendered from the same
  native-resolution panorama.
- Export captures exclude any node marked `data-editor-overlay="true"` or
  `data-export-exclude="true"`, including descendants. Guides, dividers, badges,
  rulers, safe-zone UI, selection rings and resize/rotate handles must never be
  part of a deliverable. The export temporarily removes selection styling and
  restores the editor DOM after rendering, including failed renders.
- Slice canvases disable image interpolation and use integer source rectangles;
  adjacent boundaries therefore share no source pixels and cannot create a
  one-pixel seam.
- Generated background layers are locked and carry `isCarouselBackground`; content
  layers must remain editable and survive regeneration.
- Use PNG for transparent/edge-critical artwork, ZIP for social slide packs,
  PDF for LinkedIn documents, and panorama PNG only when a continuous strip is
  explicitly needed.

## Licensing and asset provenance

The composition shapes and tokens are original VitaBlue application code. Do not
embed third-party imagery or fonts in a template unless its license and source
are recorded with the project asset. Exporting a composition does not transfer
rights to source assets. Keep attribution and license metadata with imported
assets, and use only assets approved for the intended commercial channel.
