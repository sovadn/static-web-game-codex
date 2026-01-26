const QUIZ_OPTION_COUNT = 3;
const ROSETTA_OPTION_COUNT = 4;
const TEST_QUESTION_COUNT = 10;
const UNLOCK_SCORE = 8;

const keySignatures = {
  C: {},
  G: { F: "#" },
  D: { F: "#", C: "#" },
  F: { B: "b" },
  Bb: { B: "b", E: "b" },
};

const notePools = {
  treble: {
    level1: [
      { key: "e/4", letter: "E" },
      { key: "f/4", letter: "F" },
      { key: "g/4", letter: "G" },
      { key: "a/4", letter: "A" },
      { key: "b/4", letter: "B" },
      { key: "c/5", letter: "C" },
      { key: "d/5", letter: "D" },
      { key: "e/5", letter: "E" },
      { key: "f/5", letter: "F" },
    ],
    level2: [
      { key: "c/4", letter: "C" },
      { key: "d/4", letter: "D" },
      { key: "e/4", letter: "E" },
      { key: "f/4", letter: "F" },
      { key: "g/4", letter: "G" },
      { key: "a/4", letter: "A" },
      { key: "b/4", letter: "B" },
      { key: "c/5", letter: "C" },
      { key: "d/5", letter: "D" },
      { key: "e/5", letter: "E" },
      { key: "f/5", letter: "F" },
      { key: "g/5", letter: "G" },
      { key: "a/5", letter: "A" },
      { key: "b/5", letter: "B" },
      { key: "c/6", letter: "C" },
      { key: "d/6", letter: "D" },
      { key: "e/6", letter: "E" },
      { key: "f/6", letter: "F" },
      { key: "g/6", letter: "G" },
      { key: "a/6", letter: "A" },
      { key: "b/6", letter: "B" },
      { key: "c/7", letter: "C" },
      { key: "d/7", letter: "D" },
      { key: "e/7", letter: "E" },
      { key: "f/7", letter: "F" },
      { key: "g/7", letter: "G" },
      { key: "a/7", letter: "A" },
      { key: "b/7", letter: "B" },
      { key: "c/8", letter: "C" },
    ],
  },
  bass: {
    level1: [
      { key: "c/2", letter: "C" },
      { key: "d/2", letter: "D" },
      { key: "e/2", letter: "E" },
      { key: "f/2", letter: "F" },
      { key: "g/2", letter: "G" },
      { key: "a/2", letter: "A" },
      { key: "b/2", letter: "B" },
      { key: "c/3", letter: "C" },
      { key: "d/3", letter: "D" },
      { key: "e/3", letter: "E" },
      { key: "f/3", letter: "F" },
      { key: "g/3", letter: "G" },
      { key: "a/3", letter: "A" },
      { key: "c/4", letter: "C" },
      { key: "d/4", letter: "D" },
      { key: "e/4", letter: "E" },
    ],
    level2: [
      { key: "c/2", letter: "C" },
      { key: "d/2", letter: "D" },
      { key: "e/2", letter: "E" },
      { key: "f/2", letter: "F" },
      { key: "g/2", letter: "G" },
      { key: "a/2", letter: "A" },
      { key: "b/2", letter: "B" },
      { key: "c/3", letter: "C" },
      { key: "d/3", letter: "D" },
      { key: "e/3", letter: "E" },
      { key: "f/3", letter: "F" },
      { key: "g/3", letter: "G" },
      { key: "a/3", letter: "A" },
      { key: "b/3", letter: "B" },
      { key: "c/4", letter: "C" },
      { key: "d/4", letter: "D" },
      { key: "e/4", letter: "E" },
    ],
  },
};

const letters = ["A", "B", "C", "D", "E", "F", "G"];

const intervalNames = {
  1: "2nd",
  2: "3rd",
  3: "4th",
  4: "5th",
  5: "6th",
  6: "7th",
  7: "8th",
};

const keyPoolByLevel = {
  1: ["C", "G", "F"],
  2: ["C", "G", "F", "D", "Bb"],
};

const TESTS = [
  { id: "note-treble-small-1", label: "Note · Violinski mala (g–c1)", topic: "note", clef: "treble", level: 1, track: "note-treble", order: 1, noteRange: { min: "g/4", max: "c/5" } },
  { id: "note-treble-first-1", label: "Note · Violinski prva 1 (c1–e1)", topic: "note", clef: "treble", level: 1, track: "note-treble", order: 2, noteRange: { min: "c/5", max: "e/5" } },
  { id: "note-treble-first-2", label: "Note · Violinski prva 2 (a–c1)", topic: "note", clef: "treble", level: 1, track: "note-treble", order: 3, noteRange: { min: "a/4", max: "c/5" } },
  { id: "note-treble-first-3", label: "Note · Violinski prva 3 (g–g1)", topic: "note", clef: "treble", level: 1, track: "note-treble", order: 4, noteRange: { min: "g/4", max: "g/5" } },
  { id: "note-treble-second-1", label: "Note · Violinski druga 1 (c2–e2)", topic: "note", clef: "treble", level: 2, track: "note-treble", order: 5, noteRange: { min: "c/6", max: "e/6" } },
  { id: "note-treble-second-2", label: "Note · Violinski druga 2 (c2–g2)", topic: "note", clef: "treble", level: 2, track: "note-treble", order: 6, noteRange: { min: "c/6", max: "g/6" } },
  { id: "note-treble-second-3", label: "Note · Violinski druga 3 (c2–c3)", topic: "note", clef: "treble", level: 2, track: "note-treble", order: 7, noteRange: { min: "c/6", max: "c/7" } },
  { id: "note-treble-third-1", label: "Note · Violinski treća 1 (c3–e3)", topic: "note", clef: "treble", level: 2, track: "note-treble", order: 8, noteRange: { min: "c/7", max: "e/7" } },
  { id: "note-treble-third-2", label: "Note · Violinski treća 2 (c3–g3)", topic: "note", clef: "treble", level: 2, track: "note-treble", order: 9, noteRange: { min: "c/7", max: "g/7" } },
  { id: "note-treble-third-3", label: "Note · Violinski treća 3 (c3–c4)", topic: "note", clef: "treble", level: 2, track: "note-treble", order: 10, noteRange: { min: "c/7", max: "c/8" } },
  { id: "note-treble-master", label: "Note · Violinski master (g–c4)", topic: "note", clef: "treble", level: 2, track: "note-treble", order: 11, noteRange: { min: "g/4", max: "c/8" } },

  { id: "note-bass-first-1", label: "Note · Bas prva (c1–e1)", topic: "note", clef: "bass", level: 2, track: "note-bass", order: 1, noteRange: { min: "c/4", max: "e/4" } },
  { id: "note-bass-small-1", label: "Note · Bas mala 1 (a–c1)", topic: "note", clef: "bass", level: 1, track: "note-bass", order: 2, noteRange: { min: "a/3", max: "c/4" } },
  { id: "note-bass-small-2", label: "Note · Bas mala 2 (e–g)", topic: "note", clef: "bass", level: 1, track: "note-bass", order: 3, noteRange: { min: "e/3", max: "g/3" } },
  { id: "note-bass-large-1", label: "Note · Bas velika 1 (C–e)", topic: "note", clef: "bass", level: 1, track: "note-bass", order: 4, noteRange: { min: "c/2", max: "e/2" } },
  { id: "note-bass-small-3", label: "Note · Bas mala 3 (g–c1)", topic: "note", clef: "bass", level: 1, track: "note-bass", order: 5, noteRange: { min: "g/3", max: "c/4" } },
  { id: "note-bass-small-4", label: "Note · Bas mala 4 (c–g)", topic: "note", clef: "bass", level: 1, track: "note-bass", order: 6, noteRange: { min: "c/3", max: "g/3" } },
  { id: "note-bass-small-5", label: "Note · Bas mala 5 (C–c1)", topic: "note", clef: "bass", level: 1, track: "note-bass", order: 7, noteRange: { min: "c/2", max: "c/4" } },
  { id: "note-bass-large-2", label: "Note · Bas velika 2 (C–G)", topic: "note", clef: "bass", level: 1, track: "note-bass", order: 8, noteRange: { min: "c/2", max: "g/2" } },
  { id: "note-bass-large-3", label: "Note · Bas velika 3 (C–c)", topic: "note", clef: "bass", level: 1, track: "note-bass", order: 9, noteRange: { min: "c/2", max: "c/3" } },
  { id: "note-bass-master", label: "Note · Bas master (C–e1)", topic: "note", clef: "bass", level: 2, track: "note-bass", order: 10, noteRange: { min: "c/2", max: "e/4" } },

  { id: "interval-basic-1", label: "Intervali (osnovno) 1 (2–5)", topic: "interval-basic", clef: "mixed", level: 1, track: "interval-basic", order: 1, intervalSizes: [1, 2, 3, 4] },
  { id: "interval-basic-2", label: "Intervali (osnovno) 2 (3–6)", topic: "interval-basic", clef: "mixed", level: 1, track: "interval-basic", order: 2, intervalSizes: [2, 3, 4, 5] },
  { id: "interval-basic-3", label: "Intervali (osnovno) 3 (4–8)", topic: "interval-basic", clef: "mixed", level: 2, track: "interval-basic", order: 3, intervalSizes: [3, 4, 5, 6, 7] },

  { id: "interval-adv-1", label: "Intervali (napredno) 1 (m2/v2/p2)", topic: "interval-advanced", clef: "mixed", level: 1, track: "interval-advanced", order: 1, intervalQualities: ["m2", "v2", "p2"] },
  { id: "interval-adv-2", label: "Intervali (napredno) 2 (m3/v3)", topic: "interval-advanced", clef: "mixed", level: 1, track: "interval-advanced", order: 2, intervalQualities: ["m3", "v3"] },
  { id: "interval-adv-3", label: "Intervali (napredno) 3 (č4/č5)", topic: "interval-advanced", clef: "mixed", level: 1, track: "interval-advanced", order: 3, intervalQualities: ["č4", "č5"] },
  { id: "interval-adv-4", label: "Intervali (napredno) 4 (m6/v6)", topic: "interval-advanced", clef: "mixed", level: 2, track: "interval-advanced", order: 4, intervalQualities: ["m6", "v6"] },
  { id: "interval-adv-5", label: "Intervali (napredno) 5 (m7/v7)", topic: "interval-advanced", clef: "mixed", level: 2, track: "interval-advanced", order: 5, intervalQualities: ["m7", "v7"] },
  { id: "interval-adv-6", label: "Intervali (napredno) 6 (č8)", topic: "interval-advanced", clef: "mixed", level: 2, track: "interval-advanced", order: 6, intervalQualities: ["č8"] },

  { id: "triad-1", label: "Trozvuci 1 (C/F/G)", topic: "triad", clef: "mixed", level: 1, track: "triad", order: 1, triadRoots: ["C", "F", "G"] },
  { id: "triad-2", label: "Trozvuci 2 (D/E/A)", topic: "triad", clef: "mixed", level: 1, track: "triad", order: 2, triadRoots: ["D", "E", "A"] },
  { id: "triad-3", label: "Trozvuci 3 (svi)", topic: "triad", clef: "mixed", level: 2, track: "triad", order: 3, triadRoots: ["C", "D", "E", "F", "G", "A", "B"] },

  { id: "seventh-1", label: "Četverozvuci 1 (C/F/G)", topic: "seventh", clef: "mixed", level: 1, track: "seventh", order: 1, seventhRoots: ["C", "F", "G"] },
  { id: "seventh-2", label: "Četverozvuci 2 (D/E/A)", topic: "seventh", clef: "mixed", level: 1, track: "seventh", order: 2, seventhRoots: ["D", "E", "A"] },
  { id: "seventh-3", label: "Četverozvuci 3 (svi)", topic: "seventh", clef: "mixed", level: 2, track: "seventh", order: 3, seventhRoots: ["C", "D", "E", "F", "G", "A", "B"] },

  { id: "tonality-1", label: "Tonaliteti 1 (C/G/F)", topic: "tonality", clef: "treble", level: 1, track: "tonality", order: 1, keySigs: ["C", "G", "F"] },
  { id: "tonality-2", label: "Tonaliteti 2 (D/Bb)", topic: "tonality", clef: "treble", level: 1, track: "tonality", order: 2, keySigs: ["D", "Bb"] },
  { id: "tonality-3", label: "Tonaliteti 3 (svi)", topic: "tonality", clef: "treble", level: 2, track: "tonality", order: 3, keySigs: ["C", "G", "F", "D", "Bb"] },

  { id: "parallel-1", label: "Paralelni tonaliteti 1 (C/G/F)", topic: "parallel", clef: "treble", level: 1, track: "parallel", order: 1, keySigs: ["C", "G", "F"] },
  { id: "parallel-2", label: "Paralelni tonaliteti 2 (D/Bb)", topic: "parallel", clef: "treble", level: 1, track: "parallel", order: 2, keySigs: ["D", "Bb"] },
  { id: "parallel-3", label: "Paralelni tonaliteti 3 (svi)", topic: "parallel", clef: "treble", level: 2, track: "parallel", order: 3, keySigs: ["C", "G", "F", "D", "Bb"] },

  { id: "minor-mode-1", label: "Mol vrste 1 (A-mol)", topic: "minor-mode", clef: "treble", level: 1, track: "minor-mode", order: 1, minorKeys: ["A-mol"] },
  { id: "minor-mode-2", label: "Mol vrste 2 (E-mol)", topic: "minor-mode", clef: "treble", level: 1, track: "minor-mode", order: 2, minorKeys: ["E-mol"] },
  { id: "minor-mode-3", label: "Mol vrste 3 (A/E)", topic: "minor-mode", clef: "treble", level: 2, track: "minor-mode", order: 3, minorKeys: ["A-mol", "E-mol"] },

  { id: "theory-1", label: "Teorija 1 (osnove)", topic: "theory", clef: "treble", level: 1, track: "theory", order: 1, theorySet: "basics" },
  { id: "theory-2", label: "Teorija 2 (tempo/izvod)", topic: "theory", clef: "treble", level: 1, track: "theory", order: 2, theorySet: "tempo" },
  { id: "theory-3", label: "Teorija 3 (sve)", topic: "theory", clef: "treble", level: 2, track: "theory", order: 3, theorySet: "all" },
];

const TEST_CATEGORIES = [
  { id: "note-treble", label: "Note · Violinski", description: "Mala, prva, druga i treća oktava" },
  { id: "note-bass", label: "Note · Bas", description: "Velika, mala i prva oktava" },
  { id: "interval-basic", label: "Intervali (osnovno)", description: "Sekunda, terca, kvarta, kvinta" },
  { id: "interval-advanced", label: "Intervali (napredno)", description: "Mala/velika + čisti intervali" },
  { id: "triad", label: "Trozvuci", description: "Dur i mol trozvuci" },
  { id: "seventh", label: "Četverozvuci", description: "Dur7 i mol7" },
  { id: "tonality", label: "Tonaliteti", description: "Predznaci, dur i paralelni mol" },
  { id: "parallel", label: "Paralelni tonaliteti", description: "Pitanje dur/mol parovi" },
  { id: "minor-mode", label: "Mol vrste", description: "Prirodni, harmonijski, melodijski" },
  { id: "theory", label: "Teorija", description: "Osnovni pojmovi i oznake" },
];

const TONALITY_MAP = {
  C: { major: "C-dur", minor: "a-mol" },
  G: { major: "G-dur", minor: "e-mol" },
  D: { major: "D-dur", minor: "h-mol" },
  F: { major: "F-dur", minor: "d-mol" },
  Bb: { major: "B-dur", minor: "g-mol" },
};

const MINOR_MODE_KEYS = {
  "A-mol": { keySig: "C", raised6: { key: "f/4", accidental: "#" }, raised7: { key: "g/4", accidental: "#" } },
  "E-mol": { keySig: "G", raised6: { key: "c/5", accidental: "#" }, raised7: { key: "d/5", accidental: "#" } },
};

const THEORY_QUESTIONS = [
  {
    id: "scale",
    question: "Što je ljestvica?",
    answer: "Niz tonova poredanih uzlazno ili silazno po određenom pravilu.",
  },
  {
    id: "adagio",
    question: "Što znači adagio?",
    answer: "Vrlo sporo, mirno.",
  },
  {
    id: "lento",
    question: "Što znači lento?",
    answer: "Sporo.",
  },
  {
    id: "legato",
    question: "Što znači legato?",
    answer: "Povezano, glatko izvođenje bez prekida.",
  },
  {
    id: "ligature",
    question: "Što je ligatura?",
    answer: "Poveznica koja spaja note (npr. za legato).",
  },
];
