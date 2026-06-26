# EWFM Maturity Intelligence — V3 boilerplate

This is **setup + boilerplate only** — no product screens. It exists because the
[`ewfm maturity 2`](../../ewfm%20maturity%202) codebase grew into one large single-file
prototype (`EWFMToolPrototype.tsx`, 1,500+ lines); rather than carry that file forward,
V3 starts clean from just the stack, the framework data, and the brand assets.

## What's in here

| Path | What it is |
|---|---|
| `package.json`, `vite.config.ts`, `tsconfig*.json`, `postcss.config.js`, `tailwind.config.js`, `index.html` | React + TypeScript + Vite + Tailwind boilerplate, identical to the proven `ewfm maturity 2` setup |
| `src/index.css` | BeeForce brand design tokens (HSL CSS variables), DM Sans font, print stylesheet for single-shot PDF reports |
| `src/lib/utils.ts` | `cn()` — the Tailwind class-merge helper used everywhere |
| `src/data/ewfmFramework.ts` | The full EWFM Maturity Framework: all 10 modules, 82 industry best practices, customer-value copy, and the `buildQuestion()` persona-framing helper. Pulled straight from the framework PDF/requirement doc. |
| `src/assets/logos/` | Brand logos: `beeforce-product-logo.png`, `bluetree-logo.png`, `bluetree-logo-tagline.png` |
| `src/App.tsx`, `src/main.tsx` | Minimal placeholder shell — replace `App.tsx` with the real V3 UI |

## What's NOT in here

No screens, no components, no business logic — none of the Bulk Dispatch / Assessment /
Report / Account 360 / Pipeline UI from `ewfm maturity 2`. Rebuild the product on top of
this clean base, reusing the framework data and brand assets as-is.

## Reference docs

The parent folder (`ewfm maturity V3/`) has the source material to build from:
- `EWFM Maturity Framework from requiremnt ceo.pdf` / `EWFM-requirement-content-searchable.txt` — the original framework requirement
- `External Workforce Management Maturity Framework.xlsx` — framework in spreadsheet form
- `EWFM_Campaign_Upload_Template.xlsx`, `EWFM_Demo_Database.xlsx` — sample data templates
- `EWFM-Product-Flow.md` — product flow notes
- `../ewfm maturity 2/FEATURES.md` — full feature list and user flows from the V2 prototype, useful as a spec to rebuild against

## Getting started

```bash
cd "ewfm maturity V3/code"
npm install
npm run dev
```
