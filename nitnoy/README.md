# Nitnoy, a little Thai every day

A single-file Thai trainer for English speakers, built as a clean-room
replica of Duolingo's lesson loop and Speak's speaking loop. 8 units, 24
lessons, 8 roleplay conversations, about 110 words and 55 phrases: greetings,
introducing yourself, numbers, food, shopping, getting around, compliments,
getting by.

- `index.html` is the whole app. Open it in Safari or Chrome on a phone. Progress stays on the device.
- `e2e/nitnoy.e2e.js` clicks through every flow with Playwright (`npm i playwright` first).
- `replica/` holds the planning files written with the replica-skill pack: recon, architecture, tokens, test plan, bugs, parity, brand.

Audio uses the device's Thai voice (text to speech). Speaking exercises use
the browser's speech recognition where it is allowed; otherwise they fall
back to listen-and-repeat.
