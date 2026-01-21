# Product Description

Solffeggio is a static web game for practicing music reading and basic theory.
It focuses on fast recognition of notes on staff, intervals, chords, and key
signatures through short 10-question tests with instant feedback.

## Core Experience
- Two play modes: Quiz and Rosetta Stone.
- Tests organized into tracks with unlockable progression.
- Clear visual prompt, answer lanes, and immediate correctness feedback.
- Audio cues for correct/incorrect answers.

## Game Modes
1. Quiz
   - Prompt: "Which note is shown?" or topic-specific question.
   - Answers: 3 text buttons.
   - Used for notes, intervals, chords, tonalities, minor modes, and theory.
2. Rosetta Stone
   - Prompt: "Show note X".
   - Answers: 4 buttons showing staff notation (no text labels).
   - Used for note recognition only.

## Test System and Progression
- Each test has 10 questions and a score tracker.
- Best score and attempt count are stored per test.
- Unlock rule: a test unlocks when the previous test in the same track reaches
  at least 8/10.
- Test categories list is shown via the Testovi panel.
- Test status and progress are shown in the top bar and progress pills.
- "Ponovi test" restarts the current test after completion.

## Question Types and Content
- Notes
  - Treble and bass clef pools with two difficulty levels.
  - Note ranges per test limit the pool (e.g., specific octaves).
  - Key signatures: C, G, F, D, Bb (applied to note names).
- Intervals (basic)
  - Size recognition: 2nd through 8th (labelled 2nd/3rd/4th/etc.).
- Intervals (advanced)
  - Quality recognition: minor/major/perfect (m2, v2, p2, etc.).
  - Accidentals are added to match the desired quality.
- Triads
  - Major and minor triads from selected roots.
  - Displayed as stacked notes on the staff.
- Seventh chords
  - Major7 and minor7 from selected roots.
- Tonalities
  - Identify major or relative minor from a key signature on the staff.
- Parallel tonalities
  - Identify the parallel major or minor from a named key.
- Minor modes
  - Natural, harmonic, or melodic minor, shown with raised 6/7 when needed.
- Theory
  - Multiple choice questions (e.g., scale, tempo terms, legato, ligature).

## Interaction and Feedback
- Click lanes to answer; keyboard shortcuts 1-3 (Quiz) and 1-4 (Rosetta Stone).
- Correct answers: green glow on the notation card plus success tone.
- Wrong answers: red shake/glow plus error tone.
- Feedback text explains the correct answer.

## Rendering and UI
- Staff notation rendered with VexFlow.
- Fallback loading order: local vendor build first, then CDN sources.
- Notes are highlighted with a subtle halo to improve readability.
- Responsive layout with scaling for mobile screens.

## Data and Storage
- Local storage keeps:
  - Last selected test.
  - Best score and attempts per test.
- No server dependency; runs as a static site.

## Running and Testing
- Open `index.html` directly, or serve with `python -m http.server`.
- Playwright tests are included under `tests/`.
