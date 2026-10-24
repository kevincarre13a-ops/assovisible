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
- Netlify project `nitnoy-thai` created on 2026-10-24 (https://app.netlify.com/projects/nitnoy-thai, team kevincarre1994). The deploy itself needs Kevin's go: either drag the `nitnoy/` folder onto the project's Deploys page, or connect this GitHub repo with base directory `nitnoy` and publish directory `nitnoy` (no build command). Live URL once deployed: https://nitnoy-thai.netlify.app
- The app is installable (manifest, icons, service worker): Safari Share > Add to Home Screen on iPhone, Chrome menu > Install app on Android. Progress stays on the phone; the Me screen has a backup code to copy and paste on another phone.

## Not done on purpose

No domain bought, no store listing, no account system. Kevin says go before any of that.
