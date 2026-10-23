# Brand: Nitnoy

## Name

Nitnoy, from นิดหน่อย (nít-nàwy), "a little". The promise is the method: a
little Thai every day, said out loud. It shares no sound, look or meaning with
Duolingo or Speak, and is not a pun on either.

Candidates considered: Sabai (too common as a business name in Thailand),
Khráp (hard to spell after hearing it), Mâak ("a lot", fights the angle),
Wan-níi ("today", generic), Nitnoy (kept).

Checks (screening, not legal clearance; all **to run** by Kevin before any
money is spent):

| check | where | result |
| --- | --- | --- |
| US trademark | tmsearch.uspto.gov, classes 9 and 41 | to run |
| EU trademark | euipo.europa.eu eSearch | to run |
| Thailand trademark | ipthailand.go.th | to run |
| domain | whois nitnoy.app, nitnoy.co | to run |
| App Store and Play | search "Nitnoy" | to run |
| the web | search "Nitnoy Thai" | to run |

## Palette

Celadon ground (Chiang Mai pottery) and a marigold accent (temple garlands).
Both palettes pass WCAG AA on every pair in `design/tokens.json`. Duolingo's
greens and Speak's blue are in `brand.json` so the sweep catches them.

## Logo brief

A wordmark in Mitr, lowercase, with the Thai นิดหน่อย set small under it.
Optional mark: a single marigold petal as a dot. Must work at 16px and as a
1024px icon; no owl, no bird, no speech bubble with a face.

## Voice

Plain, warm, short. Not cute, not pushy, not school-like.

| do | don't |
| --- | --- |
| "Nice. 3 in a row." | "Amazing job, superstar!" |
| "Not quite. The answer is..." | "Oops! You made a mistake" |
| "Say it out loud" | "Repeat after me, learner" |
| "Come back tomorrow to keep the streak" | "Don't lose your streak!!!" |
| "No Thai voice on this device" | "Something went wrong" |

## Sweep

Run before each publish:

```
python3 <pack>/replica-brand/sweep.py nitnoy --config nitnoy/replica/brand.json
```

Note: "Speak" is a dictionary word and also the name of the JavaScript method
that plays audio, so the sweep cannot test it. Checked by eye instead: the
word never appears as a product name in the app.
