# Recon map: Duolingo (web + mobile) and Speak (mobile), the beginner core loop

Scope: the lesson loop of Duolingo (path, lessons, exercise types, XP, streak,
mistakes review) plus the speaking loop of Speak (listen, say it, roleplay a
short conversation). Target language: Thai for an English-speaking beginner.
For: Kevin, 32, French, living in Chiang Mai. Needs survival Thai fast, wants
to practise English at the same time, likes a visible progression.
Date: 2026-10-23

## Sources (public pages and general knowledge of both apps, no account used)

| # | source | URL | notes |
| --- | --- | --- | --- |
| 1 | Duolingo help center | https://support.duolingo.com | lesson types, path, XP, streak, hearts, practice hub |
| 2 | Duolingo marketing site | https://www.duolingo.com | core loop pitch: bite-size lessons, streak, gamified |
| 3 | Duolingo App Store listing | https://apps.apple.com/app/duolingo/id570060128 | screenshots of path, lesson, lesson-complete, leaderboard |
| 4 | Speak marketing site | https://www.speak.com | "speak out loud from day one", AI roleplay, feedback on pronunciation |
| 5 | Speak App Store listing | https://apps.apple.com/app/speak/id1286609883 | screenshots: course list, listen-and-repeat drill, roleplay chat |

Nothing was scraped and no source code of either app was read. Both apps'
exact wording, mascots, logos and colours are not used (see brand.md).

## Core loop

Open the app, do one short lesson (about 3 minutes), say the new phrases out
loud, see XP and the streak grow, come back tomorrow.

## Screens

| ID | screen | route / how to reach | purpose | key components | states seen |
| --- | --- | --- | --- | --- | --- |
| S01 | Path (home) | app open, Learn tab | show progression as a vertical path of lesson nodes grouped by unit; show streak and XP | top bar (streak, XP), unit header, lesson node (locked / current / done with levels), bottom nav | first visit, mid-course, unit complete |
| S02 | Lesson | tap a node | run 10-18 exercises in a row | progress bar, close button, exercise card, option list, Check / Continue button, feedback sheet | answering, correct, wrong, mistakes replay at the end |
| S03 | Lesson complete | end of S02 | reward: XP earned, accuracy, streak kept | big stat tiles, Continue | normal, streak extended |
| S04 | Practice | Practice tab | review weak or old words without moving on the path | same exercise card as S02 | empty (nothing learned yet), filled |
| S05 | Phrasebook | Phrases tab | look up any phrase quickly in real life, hear it | search input, grouped list rows with play button | empty search, results, no results |
| S06 | Profile and settings | Me tab | stats, speaker gender, audio options, reset | stat tiles, segmented control, toggles, danger action with inline confirm | default, confirm reset |
| S07 | Talk (roleplay) | node at the end of a unit | a 4 to 6 line conversation where the user says every one of their lines (Speak's core) | chat bubbles, listen button, mic button, "I said it" fallback, reveal translation | listening, recording, matched, retry, mic unavailable |

Exercise types inside S02 (from Duolingo's lesson, plus Speak's drill):

| type | what the user does |
| --- | --- |
| new word card | sees Thai script, romanisation, meaning, hears it |
| pick the meaning | Thai shown, pick the English out of 4 |
| pick the Thai | English shown, pick the Thai out of 4 |
| tap what you hear | audio only, pick the matching Thai |
| build the sentence | tap word tiles into order from an English prompt |
| match pairs | 4 Thai to 4 English |
| say it | hears the phrase, says it into the mic, gets a match score |

## Flows

```
F01 Do today's lesson
    S01 -> S02 (x 12-18 exercises, wrong ones come back at the end) -> S03 -> S01
    happy path clicks: 1 + (2 per exercise) + 1
    edge: close mid-lesson (confirm, lose progress), no Thai voice on device,
          no microphone, device offline (must still work: everything is local)

F02 Speak a conversation (Talk)
    S01 -> S07 (each user line: listen, speak, matched) -> S03 -> S01
    edge: mic refused, recogniser returns nothing, user wants to skip speaking

F03 Review weak words
    S04 -> exercises -> S03 -> S04
    edge: fewer than 4 learned words (fallback to any words), everything strong

F04 Look up a phrase in the street
    S05 -> type "toilet" -> row -> play
    edge: typed in Thai, typed romanised, no result

F05 Change speaker gender / reset
    S06 -> toggle -> every phrase swaps khráp/phǒm for khà/chǎn
    S06 -> Reset -> inline confirm -> back to zero
```

## Components

| component | variants | states | used on |
| --- | --- | --- | --- |
| Button | primary, secondary, ghost, danger | default, hover, focus-visible, disabled | all |
| Lesson node | lesson, talk | locked, current, done level 1-3 | S01 |
| Progress bar | lesson, unit | 0-100 | S01, S02 |
| Option card | text, thai (two-line), tile | idle, selected, correct, wrong, used | S02, S04, S07 |
| Feedback sheet | correct, wrong | enter, exit | S02 |
| Stat tile | streak, xp, words | normal | S01, S03, S06 |
| Bottom nav | 4 tabs | active | S01, S04, S05, S06 |
| Chat bubble | app, you | normal, current | S07 |
| Mic button | ready, listening, unavailable | | S02, S07 |

## Inferred data model

```
Unit       id, title, subtitle, order
           evidence: S01 unit headers.  confidence: high
Lesson     id, unit_id, title, order, items[]
           evidence: S01 nodes, S02.  confidence: high
Item       id, thai, romanisation, english, note, kind (word | phrase)
           evidence: S02 cards, S05 rows.  confidence: high
Talk       id, unit_id, scene, lines[] (who, thai, romanisation, english)
           evidence: Speak roleplay screenshots.  confidence: medium
Progress   xp, streak_count, streak_last_day, lessons_done{lesson_id: times},
           items{item_id: seen, right, wrong, last_seen}, settings
           evidence: S01 top bar, S03, S06, Duolingo "practice hub" (weak words)
           confidence: medium (Duolingo's real model is hidden; this is what the UI implies)
```

Relationships: Unit 1-n Lesson, Lesson n-n Item, Unit 1-1 Talk, one Progress per device.

## Feature matrix

See `features.csv`. Must: 14, should: 8, could: 5, skip: 6.

## Out of scope (cannot or should not be cloned)

- Duolingo's owl, its green, its sounds and its sentence bank: trade dress and content.
- Leaderboards, leagues, friends, hearts and gems: a social and monetisation layer, not the learning loop. Hearts are also the top user complaint, so they are left out on purpose.
- Speak's AI tutor conversation (open-ended LLM chat) and its pronunciation model: a backend service. Replaced by on-device speech recognition with a match score.
- 40 languages. This clone is Thai for English speakers only, by design.
- Accounts, sync between devices, payments.

## Size

Screens 7, flows 5, entities 5. Hard parts: Thai text-to-speech and speech
recognition depend on the device (handled with fallbacks), romanisation that
is consistent, exercise generation that stays varied with a small vocabulary.
Size: S (a weekend). Shipped as one HTML file with no backend.
