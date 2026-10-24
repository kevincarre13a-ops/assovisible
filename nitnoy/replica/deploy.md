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
- Netlify project `nitnoy-thai` created on 2026-10-24 (https://app.netlify.com/projects/nitnoy-thai, team kevincarre1994). Deployed on Kevin's go the same day (deploy 6adcc61e35ad5f1b630cc52f), team-login protection removed. Live: https://nitnoy-thai.netlify.app. Checked after deploy: index, manifest, service worker and icons answer 200, the service worker activates, a lesson opens, no console errors. To redeploy after a change: from `nitnoy/`, `npx netlify deploy --prod --dir .` (site nitnoy-thai), or drag the folder onto the Deploys page.
- The app is installable (manifest, icons, service worker): Safari Share > Add to Home Screen on iPhone, Chrome menu > Install app on Android. Progress stays on the phone; the Me screen has a backup code to copy and paste on another phone.

## Not done on purpose

No domain bought, no store listing, no account system. Kevin says go before any of that.
