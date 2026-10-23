# Architecture: Nitnoy (a rebuild of Duolingo's lesson loop and Speak's speaking loop, for Thai)

## Stack

| layer | choice | why |
| --- | --- | --- |
| web | one static HTML file, vanilla JS, CSS custom properties | the whole course fits in one file; opens anywhere, works offline, no build step |
| database | `localStorage` on the device (key `nitnoy.v1`) | one learner, one device; nothing to host |
| auth | none | no accounts by design |
| audio | Web Speech API `speechSynthesis`, voice `th-TH` when the device has one | free, offline on iOS and Android, no API key |
| speech recognition | Web Speech API `SpeechRecognition` (`th-TH`), with a listen-and-repeat fallback | works in Chrome and Safari; refused inside the claude.ai artifact frame, so the fallback matters |
| fonts | Google Fonts: Mitr (Thai display), Sarabun (Thai + Latin body) | both open, both cover Thai and Latin |
| hosting | published as a claude.ai Artifact; the same file sits in the repo and can go to Netlify or GitHub Pages | one link for the phone |

## Schema (JavaScript shapes, no SQL)

```
Progress {
  v: 1,
  name: "Kevin",
  xp: number,
  streak: { count: number, last: "YYYY-MM-DD" | null },
  today: { day: "YYYY-MM-DD", lessons: number },
  lessons: { [lessonId]: { times: number, best: number } },
  items:   { [itemId]:   { seen, right, wrong, last: epoch ms } },
  settings: { gender: "m" | "f", rom: true, autoplay: true, rate: 0.85, speakSkip: false }
}
```

Content is a constant in the file: `UNITS[]` of `{ id, title, subtitle, lessons[], talk }`.
Every item is `[thai, romanisation, english, note?]`. In phrases, Thai and
romanisation are written with one space per word so the tile exercise can cut
both into the same number of tokens. The Thai is joined back without spaces
for display.

## "API" (pure functions, all in the file)

| function | does | flow |
| --- | --- | --- |
| `buildLesson(lesson)` | turns a lesson's items into 12-18 ordered steps (intro, mc, listen, build, match, say) | F01 |
| `buildPractice()` | picks the 8 weakest items (lowest right/wrong, oldest seen) and makes quiz-only steps | F03 |
| `adapt(item)` | applies the speaker gender (khráp/phǒm to khà/chǎn) | F05 |
| `speak(thai)` | text to speech with the Thai voice | all |
| `listen(onResult)` | one speech recognition round, `th-TH`, resolves text or `null` | F01, F02 |
| `similarity(a, b)` | Levenshtein ratio on space-free Thai, pass at 0.55 | F01, F02 |
| `award(xp)` / `touchStreak()` | progress updates, saved on every change | F01-F03 |

## The parts that bite

- Thai voice: not every device has one. `getVoices()` loads async, so the app checks at lesson build time and replaces "tap what you hear" with a visual exercise when no Thai voice exists.
- Microphone: refused without a prompt inside the artifact viewer. Every speaking step must degrade to listen-and-repeat with a self-check button, and say so once, calmly.
- Romanisation: one system throughout (Paiboon-style with tone marks: à low, â falling, á high, ǎ rising, unmarked mid). Tokens in a phrase must equal tokens in its Thai.
- Streak day boundary: compare local calendar dates, not 24h windows.
- Distractors: with a small vocabulary, multiple choice must avoid two options with the same English (e.g. "where" twice).
- localStorage can throw (private mode): every read and write is wrapped, the app runs without saving.

## Build order

1. Vertical slice: S01 path with units -> S02 lesson with intro + two multiple choice types -> S03 complete -> XP and streak saved. (Lesson 1.1 end to end.)
2. Must-haves: listen, build-sentence, mistakes replay, say-it with mic and fallback, Talk roleplay (S07).
3. Should-haves: match pairs, practice (S04), lesson levels, daily goal, voice speed.
4. Could-haves and additions: phrasebook (S05), gender switch, dark theme, reset.
5. Fixes from the brief (fixes.md): no hearts, speaking in every lesson, one tight vocabulary.
