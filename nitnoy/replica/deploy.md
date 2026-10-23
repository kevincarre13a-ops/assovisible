# Deploy: Nitnoy

## Preflight (2026-10-23)

| check | result |
| --- | --- |
| e2e click-through (`node e2e/nitnoy.e2e.js`) | pass, 0 console errors |
| parity (`parity.py replica/features.csv`) | 100 on counted rows, 14/14 must-haves |
| rebrand sweep (`sweep.py nitnoy --config replica/brand.json`) | clean |
| store listing | not applicable, no store release |
| open S1 / S2 bugs | none |
| production build | none needed, one static file |

## Where it is live

- claude.ai Artifact (private to Kevin's account): https://claude.ai/artifact/9HisopXZHqSBEo7TkpB2mZ
  Known limit: the artifact frame refuses the microphone, so speaking steps use listen-and-repeat there.
- For microphone scoring, open `nitnoy/index.html` from a real https host: drop the `nitnoy/` folder on Netlify (as the coteaux-chaponost site is), or enable GitHub Pages on this repo. Nothing to configure, no build.

## Not done on purpose

No domain bought, no store listing, no account system. Kevin says go before any of that.
