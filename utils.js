function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function applyKeySignature(letter, keySig) {
  const accidental = keySignatures[keySig][letter] || "";
  return { letter, accidental };
}

function formatNoteName(letter, accidental, lowercase = false) {
  const accidentalSymbol = accidental === "#" ? "\u266F" : accidental === "b" ? "\u266D" : "";
  let baseLetter = letter;
  if (letter === "B") {
    baseLetter = accidental === "b" ? "B" : "H";
  }
  if (lowercase) {
    baseLetter = baseLetter.toLowerCase();
  }
  return `${baseLetter}${accidentalSymbol}`;
}

function formatNoteLabel(noteKey, keySig, clef, options = {}) {
  const [rawLetter, rawOctave] = String(noteKey).split("/");
  const letter = rawLetter ? rawLetter.toUpperCase() : "";
  const applied = applyKeySignature(letter, keySig);
  const label = formatNoteName(applied.letter, applied.accidental, options.lowercase);
  if (options.includeOctave === false) {
    return label;
  }
  const octaveValue = Number(rawOctave);
  let solfegeOctave = octaveValue;
  if (!Number.isNaN(octaveValue)) {
    if (clef === "treble") solfegeOctave = octaveValue - 3;
    if (clef === "bass") solfegeOctave = octaveValue - 1;
  }
  if (clef === "bass" && options.bassOctaveStyle) {
    if (solfegeOctave === 2) {
      return label;
    }
    if (solfegeOctave === 1) {
      return formatNoteName(applied.letter, applied.accidental, false);
    }
    if (solfegeOctave > 2) {
      return `${label}${solfegeOctave - 2}`;
    }
  }
  return `${label}${Number.isNaN(solfegeOctave) ? "" : solfegeOctave}`;
}

function noteKeyToMidi(noteKey) {
  if (!noteKey) return null;
  const [rawLetter, rawOctave] = String(noteKey).split("/");
  const letter = rawLetter.toLowerCase();
  const octave = Number(rawOctave);
  const semitoneByLetter = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  let semitone = semitoneByLetter[letter];
  if (semitone === undefined || Number.isNaN(octave)) return null;
  return (octave + 1) * 12 + semitone;
}

function noteKeyToMidiWithKeySig(noteKey, keySig) {
  if (!noteKey) return null;
  const [rawLetter, rawOctave] = String(noteKey).split("/");
  const letter = rawLetter.toLowerCase();
  const octave = Number(rawOctave);
  const semitoneByLetter = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  let semitone = semitoneByLetter[letter];
  if (semitone === undefined || Number.isNaN(octave)) return null;
  const accidental = keySignatures[keySig]?.[letter.toUpperCase()] || "";
  if (accidental === "#") semitone += 1;
  if (accidental === "b") semitone -= 1;
  return (octave + 1) * 12 + semitone;
}

function getPool(clef, level) {
  const levelKey = level === 1 ? "level1" : "level2";
  return notePools[clef][levelKey];
}

function getNotePoolForTest(test, clef) {
  const basePool = getPool(clef, test.level);
  if (!test.noteRange) return basePool;
  const minMidi = noteKeyToMidi(test.noteRange.min);
  const maxMidi = noteKeyToMidi(test.noteRange.max);
  if (minMidi === null || maxMidi === null) return basePool;
  const [low, high] = minMidi <= maxMidi ? [minMidi, maxMidi] : [maxMidi, minMidi];
  const filtered = basePool.filter((entry) => {
    const midi = noteKeyToMidi(entry.key);
    return midi !== null && midi >= low && midi <= high;
  });
  return filtered.length ? filtered : basePool;
}

function pickClef(allowedClefs, level) {
  const clefs = Array.isArray(allowedClefs) && allowedClefs.length > 0 ? allowedClefs : ["treble", "bass"];
  if (clefs.length === 1) return clefs[0];
  const prefersTreble = level === 1 || Math.random() < 0.55;
  if (prefersTreble) {
    return clefs.includes("treble") ? "treble" : clefs[0];
  }
  return clefs.includes("bass") ? "bass" : clefs[0];
}
