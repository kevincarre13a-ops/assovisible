# Bugs: Nitnoy

### BUG-001: Feedback sheet icon fills the screen
- Severity: S3
- Flow / case: F01-H1
- Screen: S02
- Build: first build  Browser / device: Chromium 390px
Steps: 1. answer any question wrong  2. look at the feedback sheet
Expected: a 26px tick or cross next to the title
Actual: the SVG had no size and grew to the sheet width
Evidence: replica/clone-screens/S02-wrong.png (before fix)
Status: fixed (`.sheet h3 svg` sized)

### BUG-002: Match pairs shows Thai and romanisation on one line
- Severity: S4
- Flow / case: F01-H1
- Screen: S02 (match)
Steps: 1. reach the match-pairs step
Expected: Thai on one line, romanisation under it
Actual: inline spans ran together
Status: fixed (`.opt .t > span` block)

### BUG-003: "day streak, extended" clipped on the lesson-complete tiles
- Severity: S4
- Screen: S03
Expected: label wraps
Actual: nowrap + ellipsis clipped the word
Status: fixed (labels wrap inside the done tiles)

### BUG-004: Slashed zero in Mitr reads as Ø on the stat tiles
- Severity: S4
- Screen: S01, S04
Status: fixed (numbers use Sarabun bold)

## To check (not reproduced here)
- Speech recognition scoring thresholds (0.55 pass, 0.85 "clear") were set by reasoning, not by measurement, because headless Chromium has no microphone. Kevin should try five phrases in Chrome on the phone and say whether it is too strict or too lax.
- iOS Safari: Thai voice name and quality vary by device; the Me screen shows which voice was found.
