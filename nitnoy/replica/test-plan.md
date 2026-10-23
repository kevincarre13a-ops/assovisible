# Test plan: Nitnoy

Build: see build-log.md  Date: 2026-10-23  Env: local file, Chromium (Playwright), 390x844 and 1440x900

Run: `node e2e/nitnoy.e2e.js [path/to/index.html] [screenshot dir]` (needs `playwright` installed; it uses `window.NITNOY` to read the correct answer, then clicks by role and label).

| case | flow | type | steps | expected | auto | result |
| --- | --- | --- | --- | --- | --- | --- |
| F01-H1 | do a lesson | happy | open path, tap lesson 1, answer every step (one wrong on purpose) | lesson complete screen, XP added, streak 1, lesson 2 unlocked, mistake replayed at the end | e2e | pass |
| F01-H2 | do a phrase lesson | happy | lesson 1.3: build-sentence tiles, say-it | tiles judged correct, say-it falls back when the mic gives nothing | e2e | pass |
| F01-E1 | quit mid-lesson | edge | tap X, confirm Quit | overlay closes, path intact | e2e | pass |
| F01-E2 | no Thai voice | edge | device without th voice | listen steps replaced by visual ones, play button says "No voice on this device" | e2e (headless has no voice) | pass |
| F01-E3 | mic refused | edge | recogniser errors not-allowed | listen-and-repeat fallback with "I said it" | manual (Chrome, mic denied) | to check by Kevin |
| F01-E4 | phone width | edge | 390px | no horizontal scroll | e2e | pass |
| F01-E5 | keyboard only | edge | Tab to an option, Enter to check and continue | works (Enter triggers the main button) | manual | to check by Kevin |
| F02-H1 | roleplay | happy | finish unit 1, open Talk, say every line (fallback) | conversation done, +15 XP, talk recorded | e2e | pass |
| F03-H1 | practice | happy | after one lesson open Practice | start button visible, round of 8 quiz steps | e2e (button), manual (round) | pass / to check |
| F03-E1 | practice too early | edge | fresh device | empty state asks to finish a lesson first | e2e (by code path) | pass |
| F04-H1 | phrasebook search | happy | type "toilet", "khǎw", "khaw", "zzzz" | 2 rows, 9 rows, 9 rows (accents ignored), empty state | e2e | pass |
| F05-H1 | gender switch | happy | Me, choose khà / chǎn, search "my name" | ฉันชื่อเควิน | e2e | pass |
| F05-H2 | reset | happy | Me, Reset, confirm | everything zero, name kept | manual | to check by Kevin |
| F06-H1 | dark theme | happy | OS dark | tokens swap, all text readable | screenshot | pass |
| F06-H2 | desktop | happy | 1440px | column centred, nothing stretched | screenshot | pass |
