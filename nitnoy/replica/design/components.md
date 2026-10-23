# Nitnoy components

Tokens only. Focus rings use `--ring` (2px, offset 2px): dark marigold in light
mode because marigold itself does not reach 3:1 on the celadon ground.

```
Button
  variants  primary (accent fill, on-accent text), secondary (surface, border), ghost, danger
  sizes     md 48px (the only size; thumbs)
  states    default, hover (darken 6%), active (translate 1px), focus-visible, disabled (50%)
  a11y      real <button>, label never changes while loading

Lesson node (path)
  variants  lesson (round, 72px), talk (round, speech-bubble glyph)
  states    locked (surface, muted glyph), current (accent ring, pulse unless reduced motion),
            done (accent fill) with 1-3 level ticks under it
  a11y      <button> with aria-label "Unit 1, lesson 2: How are you?, done, level 2"

Option card
  variants  text (English), thai (Thai script + romanisation line), tile (for sentence building)
  states    idle, selected (ring + surface tint), correct (success border), wrong (danger border), used (hidden tile)
  a11y      <button aria-pressed>, keyboard reachable, 48px min height

Feedback sheet
  variants  correct (success tint), wrong (danger tint, shows the right answer)
  motion    slides up 220ms; none with prefers-reduced-motion
  a11y      role=status, the Continue button takes focus

Progress bar      lesson (accent on border), 8px, rounded, aria-valuenow
Stat tile         number in Mitr 26px, label Sarabun 14px muted; streak / xp / today
Bottom nav        4 tabs, 56px + safe area, aria-current=page on the active tab
Chat bubble       app (surface, left), you (accent tint, right); current line has the ring
Mic button        ready (accent), listening (pulse + "Listening..."), unavailable (hidden; fallback shown)
```
