# Location Nearby Card CTA Alignment

## Goal

Align every `location-nearby-card` text link on one shared horizontal
baseline, even when card titles and descriptions have different heights.

## Design

Use the existing card markup and make each `.location-nearby-card` a vertical
flex container. Let the card's `.text-link` consume the remaining vertical
space above it with an automatic top margin. Keep the CTA itself on one line.

This is preferred over fixed title or description heights because Contentful
copy can vary, and over CSS subgrid because the existing layout only needs one
bottom-aligned element.

## Scope

- Change only the location nearby-card CSS and its focused validation.
- Do not change JSX, Contentful fields, or content.
- Preserve the existing four-column desktop and one-column mobile layouts.
- Allow titles and descriptions to wrap normally.
- Keep CTA labels and arrows on one line.

## Verification

- A focused validation checks that nearby cards use a column flex layout and
  their text links use an automatic top margin and do not wrap.
- Existing layout and media validation scripts continue to pass.
- The location page returns HTTP 200 and renders the nearby cards.
