## Parity: 100.0 / 100

features 100.0  (27 counted, must-haves 14 of 14 done)

## By area, weakest first
- path                         100.0  (3 features)
- lesson                       100.0  (9 features)
- progress                     100.0  (6 features)
- speaking                     100.0  (4 features)
- practice                     100.0  (1 features)
- platform                     100.0  (2 features)
- settings                     100.0  (2 features)

## Missing, in build order
- nothing. Every counted feature is done.

## Left out on purpose (not scored)
- Hearts (limited mistakes): top user complaint; left out on purpose
- Leaderboards and leagues: social layer; not the learning loop
- Friends and streak society: social layer
- Open-ended AI tutor chat: backend service; replaced by scripted roleplay
- Accounts and cross-device sync: no backend by design
- 40 languages: Thai only by design

## Yours, not in the original (not scored)
- Phrasebook with search and audio
- Speaker gender switch (khráp / khà)

## Layout diff

Not run. No screenshots of Duolingo or Speak were saved (clean room, no
account used), so `imgdiff.py` has nothing to compare against. The layout
was rebuilt from the recon map's structure only: stats on top, a vertical
path of nodes, a progress bar over each exercise, one big action button at
the bottom, a feedback sheet that slides up.

## Behaviour diff

| flow | original does | Nitnoy does | fix or keep |
| --- | --- | --- | --- |
| wrong answer | Duolingo takes a heart; out of hearts stops you | no hearts; the item comes back at the end | keep (fix from the brief) |
| speaking | Duolingo: optional, rare; Speak: every exercise | 2 say-it steps per lesson plus a roleplay per unit | keep |
| mic refused | Duolingo skips speaking for an hour | listen-and-repeat with "I said it", or skip for the session | keep |
| lesson length | 12-18 exercises, ~3 minutes | same | keep |
| lookup in the street | not in Duolingo; Speak has a phrase list in some courses | phrasebook with search and audio | keep (addition) |
| clicks on the core flow | tap node, 2 taps per exercise, 1 to finish | same | parity |

## Verdict

Shippable: all 14 must-haves done, feature score 100 on the counted rows, no
open S1 or S2. "Better than the original" for this one learner's brief
(speaking in every lesson, no hearts, phrasebook, gender switch), with the
honest caveat that the clone covers Thai only and has no account, no social
layer and no AI tutor. Speech scoring thresholds are untested with a real
microphone (see bugs.md).
