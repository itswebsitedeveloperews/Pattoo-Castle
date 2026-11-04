# Homepage performance optimization — 4 November 2026

## Baseline

Source: https://pagespeed.web.dev/analysis/https-pattoocastle-com/nr2g1496m9

| Metric | Mobile | Desktop |
| --- | --- | --- |
| Performance | 87 | 91 |
| FCP | 1.9 s | 0.5 s |
| LCP | 3.3 s | 0.9 s |
| Speed Index | 4.6 s | 3.1 s |
| Total Blocking Time | 110 ms | 90 ms |
| CLS | 0 | 0.001 |

The supplied report contains both Lighthouse results. Mobile flags approximately
1,510 ms of render-blocking savings, oversized images, and unused Maps/Analytics
JavaScript. The logo lacks a high-priority hint. It also reports a failed request
for the Contentful hero video; the original video URL is retained.

## Changes

- Replace the runtime Google Fonts CSS import with the same self-hosted BIZ
  UDPMincho Latin font. Load Quattrocento Sans through `next/font/local` with
  preloads and a metric-adjusted fallback.
- Preload the existing Denton regular font, losslessly converted from 42,264-byte
  OTF to 19,760-byte WOFF2. Glyph order and all font tables except the container
  header were compared and match. Add immutable caching for its versioned URL.
- Add responsive Contentful image widths without changing format or quality.
  Prioritize the logo and supply its CMS intrinsic dimensions.
- Lazy-load homepage intro/gallery images, hidden menu imagery, and footer icons.
- Start Google Maps within 300 px of the viewport instead of the browser's much
  larger native iframe threshold. Preserve the frame, attributes, and a no-JS
  fallback. Disconnect the observer on activation and unmount.
- Queue Analytics after hydration and load its external script during idle time.

Layout CSS, breakpoints, AOS configuration, animation rules, carousel behavior,
lightbox behavior, content, navigation, and media URLs were retained. Shared and
interactive CSS was not purged based only on initial-viewport coverage.

## Verification

- Production build passes with the real Contentful content from `.env.local`.
- Generated homepage and downloaded live homepage have identical headings,
  section classes/order, links, image source URLs, and video source URLs.
- Image preloads decrease from 16 to 3; 13 of 18 images are lazy-loaded and 12
  images have responsive source sets. Google Fonts external CSS is absent.
- All 13 existing test commands were run against this tree and a separate HEAD
  source snapshot. Eight pass; the same five commands fail with identical output
  in both: `test:layout`, `test:reserve-logo`, `test:media`,
  `test:gallery-lightbox`, and `test:location-nearby-cta`. No new test failures
  were found.

## Pending verification

No new PageSpeed score is claimed. Fresh mobile and desktop PageSpeed API requests
returned HTTP 429. Browser/native UI access is unavailable, so visual and
interactive regression checks remain outstanding. No local Netlify login or site
binding was found; these changes have not been deployed by this session.

After deployment, verify desktop/mobile appearance, menu interactions, gallery
lightbox, animations, video playback, and map loading on scroll. Then run fresh
mobile and desktop tests at https://pagespeed.web.dev/ and iterate on the measured
results. A fixed 100/100 score cannot be verified from build or HTML checks alone.
