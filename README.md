# LC Power Washing — Website

Single-page marketing site for **LC Power Washing**, a pressure washing and soft washing
business serving Los Angeles, California (rated 5.0 from 11 Google reviews).

## Stack

Vanilla HTML, CSS and JavaScript — no build step, no dependencies.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Entry point: hero, services, process, reviews, FAQ, contact form, footer |
| `styles.css` | All styling (mobile-first, responsive, reduced-motion and print support) |
| `script.js` | Mobile nav, sticky-header state, form validation and fetch submission |
| `favicon.svg` | Site icon |

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```sh
python3 -m http.server 8000
```

## Contact form

The contact form POSTs to the LeadrVision endpoint in its `action` attribute. JavaScript
enhances the submission with `fetch()` to the same URL and shows an inline confirmation;
with JavaScript disabled the plain HTML POST still works and the visitor returns with
`?submitted=1`, which also renders the confirmation. Hidden `_form`, `_page` and `_gotcha`
(honeypot) fields are included.

## Notes

- "Leave us a review" links point to the relative path `/review`, which is provided by the
  hosting platform — this repo intentionally does not define that route.
- No stock or external images are used; all visuals are CSS gradients and inline SVG.
