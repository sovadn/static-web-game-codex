let questionId = 0;

function buildNoteOptions({ pool, keySig, baseNote, count }) {
  const optionCount = Math.max(2, Math.min(4, Number(count) || QUIZ_OPTION_COUNT));
  const baseIndex = Math.max(0, pool.findIndex((entry) => entry.key === baseNote.key));
  const indices = [];
  let step = 0;
  while (indices.length < optionCount && (baseIndex - step >= 0 || baseIndex + step < pool.length)) {
    if (step === 0) {
      indices.push(baseIndex);
    } else {
      if (baseIndex - step >= 0) indices.push(baseIndex - step);
      if (indices.length < optionCount && baseIndex + step < pool.length) indices.push(baseIndex + step);
    }
    step += 1;
  }

  const entries = indices.map((index) => pool[index]).filter(Boolean);
  const optionEntries = shuffle(entries).slice(0, optionCount);
  const optionNoteKeys = optionEntries.map((entry) => entry.key);
  const options = optionEntries.map((entry) => {
    const applied = applyKeySignature(entry.letter, keySig);
    return formatNoteName(applied.letter, applied.accidental);
  });
  const correctIndex = optionEntries.findIndex((entry) => entry.key === baseNote.key);

  return { options, optionNoteKeys, correctIndex };
}

function generateNoteQuestion(test) {
  const clefOptions = test.clef === "mixed" ? ["treble", "bass"] : [test.clef];
  const clef = pickClef(clefOptions, test.level);
  const keySig = randomItem(keyPoolByLevel[test.level]);
  const pool = getNotePoolForTest(test, clef);
  const note = randomItem(pool);
  const correctName = formatNoteLabel(note.key, keySig, clef, {
    lowercase: true,
    bassOctaveStyle: true,
  });
  const { optionNoteKeys, correctIndex } = buildNoteOptions({
    pool,
    keySig,
    baseNote: note,
    count: QUIZ_OPTION_COUNT,
  });
  const optionLabels = optionNoteKeys.map((noteKey) =>
    formatNoteLabel(noteKey, keySig, clef, { lowercase: true, bassOctaveStyle: true })
  );

  return {
    id: `q-${questionId++}`,
    type: "NOTE",
    mode: "QUIZ",
    topic: test.topic,
    clef,
    keySig,
    notes: [note],
    prompt: "Which note is shown?",
    options: optionLabels,
    optionNoteKeys,
    correctIndex,
    explanation: `Correct: ${correctName}.`,
  };
}

function generateRosettaQuestion(test) {
  const clefOptions = test.clef === "mixed" ? ["treble", "bass"] : [test.clef];
  const clef = pickClef(clefOptions, test.level);
  const keySig = randomItem(keyPoolByLevel[test.level]);
  const pool = getNotePoolForTest(test, clef);
  const note = randomItem(pool);
  const { optionNoteKeys, correctIndex } = buildNoteOptions({
    pool,
    keySig,
    baseNote: note,
    count: ROSETTA_OPTION_COUNT,
  });
  const noteLabel = formatNoteLabel(note.key, keySig, clef, {
    lowercase: true,
    bassOctaveStyle: true,
  });
  const optionLabels = optionNoteKeys.map((noteKey) =>
    formatNoteLabel(noteKey, keySig, clef, { lowercase: true, bassOctaveStyle: true })
  );

  return {
    id: `q-${questionId++}`,
    type: "NOTE",
    mode: "ROSETTA",
    topic: test.topic,
    clef,
    keySig,
    notes: [note],
    prompt: `Show note ${noteLabel}`,
    options: optionLabels,
    optionNoteKeys,
    correctIndex,
    explanation: `Correct: ${noteLabel}.`,
  };
}

function buildIntervalOptions(correctName, count, pool) {
  const optionCount = Math.max(2, Math.min(4, Number(count) || QUIZ_OPTION_COUNT));
  const names = Array.isArray(pool) && pool.length ? pool : ["2nd", "3rd", "4th", "5th", "6th", "7th", "8th"];
  const options = new Set([correctName]);
  const index = names.indexOf(correctName);
  if (index > 0) options.add(names[index - 1]);
  if (index < names.length - 1) options.add(names[index + 1]);
  while (options.size < optionCount) {
    options.add(randomItem(names));
  }
  return shuffle(Array.from(options)).slice(0, optionCount);
}

function getIntervalSpec(label) {
  const specs = {
    m2: { size: 1, semitones: 1 },
    v2: { size: 1, semitones: 2 },
    p2: { size: 1, semitones: 3 },
    m3: { size: 2, semitones: 3 },
    v3: { size: 2, semitones: 4 },
    "č4": { size: 3, semitones: 5 },
    "č5": { size: 4, semitones: 7 },
    m6: { size: 5, semitones: 8 },
    v6: { size: 5, semitones: 9 },
    m7: { size: 6, semitones: 10 },
    v7: { size: 6, semitones: 11 },
    "č8": { size: 7, semitones: 12 },
  };
  return specs[label] || null;
}

function describeIntervalQuality(lowerKey, upperKey, size, keySig) {
  const lowerMidi = noteKeyToMidiWithKeySig(lowerKey, keySig);
  const upperMidi = noteKeyToMidiWithKeySig(upperKey, keySig);
  if (lowerMidi === null || upperMidi === null) return null;
  const semitones = upperMidi - lowerMidi;
  const majorSemitones = { 1: 2, 2: 4, 5: 9, 6: 11 };
  const perfectSemitones = { 3: 5, 4: 7, 7: 12 };
  if (majorSemitones[size] !== undefined) {
    if (semitones === majorSemitones[size]) return `v${size + 1}`;
    if (semitones === majorSemitones[size] - 1) return `m${size + 1}`;
    return null;
  }
  if (perfectSemitones[size] !== undefined) {
    if (semitones === perfectSemitones[size]) return `č${size + 1}`;
    return null;
  }
  return null;
}

function buildIntervalForQuality(pool, qualityLabel) {
  const spec = getIntervalSpec(qualityLabel);
  if (!spec) {
    return { lower: pool[0], upper: pool[1], label: qualityLabel, accidentals: null };
  }
  let attempts = 0;
  while (attempts < 60) {
    attempts += 1;
    const baseIndex = Math.floor(Math.random() * (pool.length - spec.size));
    if (baseIndex < 0) continue;
    const lower = pool[baseIndex];
    const upper = pool[baseIndex + spec.size];
    const naturalDiff = noteKeyToMidi(upper.key) - noteKeyToMidi(lower.key);
    const delta = spec.semitones - naturalDiff;
    if (delta === 0) {
      return { lower, upper, label: qualityLabel, accidentals: [null, null] };
    }
    if (delta === 1) {
      return { lower, upper, label: qualityLabel, accidentals: [null, "#"] };
    }
    if (delta === -1) {
      return { lower, upper, label: qualityLabel, accidentals: [null, "b"] };
    }
  }
  return { lower: pool[0], upper: pool[Math.min(pool.length - 1, spec.size)], label: qualityLabel, accidentals: [null, null] };
}

function generateIntervalQuestion(test) {
  const clefOptions = test.clef === "mixed" ? ["treble", "bass"] : [test.clef];
  const clef = pickClef(clefOptions, test.level);
  const hasQualities = Array.isArray(test.intervalQualities) && test.intervalQualities.length;
  const keySig = hasQualities ? "C" : randomItem(keyPoolByLevel[test.level]);
  const pool = getPool(clef, test.level);
  const sizes = Array.isArray(test.intervalSizes) && test.intervalSizes.length ? test.intervalSizes : [1, 2, 3, 4, 5, 6, 7];
  let lower = null;
  let upper = null;
  let intervalName = null;
  let options = [];
  let correctIndex = -1;
  let accidentals = null;

  if (hasQualities) {
    const qualityPool = test.intervalQualities;
    const desiredQuality = randomItem(qualityPool);
    const built = buildIntervalForQuality(pool, desiredQuality);
    lower = built.lower;
    upper = built.upper;
    intervalName = built.label;
    accidentals = built.accidentals;
    options = buildIntervalOptions(intervalName, QUIZ_OPTION_COUNT, qualityPool);
    correctIndex = options.indexOf(intervalName);
  } else {
    const size = randomItem(sizes);
    let baseIndex = Math.floor(Math.random() * (pool.length - size));
    if (baseIndex < 0) baseIndex = 0;
    lower = pool[baseIndex];
    upper = pool[baseIndex + size];
    intervalName = intervalNames[size];
    options = buildIntervalOptions(intervalName, QUIZ_OPTION_COUNT, sizes.map((value) => intervalNames[value]));
    correctIndex = options.indexOf(intervalName);
  }

  return {
    id: `q-${questionId++}`,
    type: "INTERVAL",
    mode: "QUIZ",
    topic: test.topic,
    clef,
    keySig,
    notes: [lower, upper],
    accidentals,
    prompt: "What interval is shown?",
    options,
    correctIndex,
    explanation: `Correct: ${intervalName}.`,
  };
}

function formatChordName(letter, quality) {
  if (!letter) return "";
  const base = letter === "B" ? "H" : letter;
  return quality === "mol" ? `${base}-mol` : `${base}-dur`;
}

function buildTriadOptions(correctName, roots, qualities) {
  const options = new Set([correctName]);
  while (options.size < QUIZ_OPTION_COUNT) {
    const root = randomItem(roots);
    const quality = randomItem(qualities);
    options.add(formatChordName(root, quality));
  }
  return shuffle(Array.from(options)).slice(0, QUIZ_OPTION_COUNT);
}

function buildTriadNotes(rootKey, quality) {
  const [rawLetter, rawOctave] = String(rootKey).split("/");
  const rootLetter = rawLetter.toUpperCase();
  const rootOctave = Number(rawOctave);
  const letterOrder = ["C", "D", "E", "F", "G", "A", "B"];
  const rootIndex = letterOrder.indexOf(rootLetter);
  if (rootIndex < 0 || Number.isNaN(rootOctave)) return null;
  const rootMidi = noteKeyToMidi(rootKey);
  if (rootMidi === null) return null;
  const thirdIndex = rootIndex + 2;
  const fifthIndex = rootIndex + 4;
  const thirdLetter = letterOrder[thirdIndex % 7];
  const fifthLetter = letterOrder[fifthIndex % 7];
  const thirdOctave = rootOctave + Math.floor(thirdIndex / 7);
  const fifthOctave = rootOctave + Math.floor(fifthIndex / 7);
  const thirdKey = `${thirdLetter.toLowerCase()}/${thirdOctave}`;
  const fifthKey = `${fifthLetter.toLowerCase()}/${fifthOctave}`;
  const thirdMidi = noteKeyToMidi(thirdKey);
  const fifthMidi = noteKeyToMidi(fifthKey);
  if (thirdMidi === null || fifthMidi === null) return null;
  const targetThird = quality === "mol" ? 3 : 4;
  const targetFifth = 7;
  const thirdDelta = targetThird - (thirdMidi - rootMidi);
  const fifthDelta = targetFifth - (fifthMidi - rootMidi);
  if (![-1, 0, 1].includes(thirdDelta) || ![-1, 0, 1].includes(fifthDelta)) {
    return null;
  }
  const accidentalForDelta = (delta) => (delta === 1 ? "#" : delta === -1 ? "b" : null);
  const downOctave = (key) => {
    const [letterPart, octavePart] = String(key).split("/");
    const octaveNum = Number(octavePart);
    if (Number.isNaN(octaveNum)) return key;
    return `${letterPart}/${octaveNum - 1}`;
  };
  const voicing = Math.floor(Math.random() * 3);
  let keys;
  let accidentals;
  if (voicing === 1) {
    const fifthDown = downOctave(fifthKey);
    keys = [rootKey, thirdKey, fifthDown];
    accidentals = [null, accidentalForDelta(thirdDelta), accidentalForDelta(fifthDelta)];
  } else if (voicing === 2) {
    const thirdDown = downOctave(thirdKey);
    const fifthDown = downOctave(fifthKey);
    keys = [rootKey, thirdDown, fifthDown];
    accidentals = [null, accidentalForDelta(thirdDelta), accidentalForDelta(fifthDelta)];
  } else {
    keys = [rootKey, thirdKey, fifthKey];
    accidentals = [null, accidentalForDelta(thirdDelta), accidentalForDelta(fifthDelta)];
  }

  return { keys, accidentals };
}

function generateTriadQuestion(test) {
  const clefOptions = test.clef === "mixed" ? ["treble", "bass"] : [test.clef];
  const clef = pickClef(clefOptions, test.level);
  const pool = getPool(clef, test.level);
  const roots = Array.isArray(test.triadRoots) && test.triadRoots.length
    ? test.triadRoots
    : ["C", "D", "E", "F", "G", "A", "B"];
  const qualities = ["dur", "mol"];
  let attempts = 0;
  let root = null;
  let triad = null;
  let quality = null;
  const rootCandidates = pool.filter((entry) => roots.includes(entry.letter));
  const selectionPool = rootCandidates.length ? rootCandidates : pool;
  while (attempts < 50 && !triad) {
    attempts += 1;
    const candidate = randomItem(selectionPool);
    const chosenQuality = randomItem(qualities);
    const built = buildTriadNotes(candidate.key, chosenQuality);
    if (built) {
      root = candidate;
      triad = built;
      quality = chosenQuality;
    }
  }
  if (!triad) {
    root = selectionPool[0];
    quality = "dur";
    triad = buildTriadNotes(root.key, quality);
  }
  const chordName = formatChordName(root.letter, quality);
  const options = buildTriadOptions(chordName, roots, qualities);
  const correctIndex = options.indexOf(chordName);

  return {
    id: `q-${questionId++}`,
    type: "TRIAD",
    mode: "QUIZ",
    topic: test.topic,
    clef,
    keySig: "C",
    notes: triad.keys.map((key) => ({ key })),
    accidentals: triad.accidentals,
    prompt: "Which chord is shown?",
    options,
    correctIndex,
    explanation: `Correct: ${chordName}.`,
  };
}

function formatSeventhName(letter, quality) {
  if (!letter) return "";
  const base = letter === "B" ? "H" : letter;
  return quality === "mol" ? `${base}-mol7` : `${base}-dur7`;
}

function buildSeventhOptions(correctName, roots, qualities) {
  const options = new Set([correctName]);
  while (options.size < QUIZ_OPTION_COUNT) {
    const root = randomItem(roots);
    const quality = randomItem(qualities);
    options.add(formatSeventhName(root, quality));
  }
  return shuffle(Array.from(options)).slice(0, QUIZ_OPTION_COUNT);
}

function buildSeventhNotes(rootKey, quality) {
  const [rawLetter, rawOctave] = String(rootKey).split("/");
  const rootLetter = rawLetter.toUpperCase();
  const rootOctave = Number(rawOctave);
  const letterOrder = ["C", "D", "E", "F", "G", "A", "B"];
  const rootIndex = letterOrder.indexOf(rootLetter);
  if (rootIndex < 0 || Number.isNaN(rootOctave)) return null;
  const rootMidi = noteKeyToMidi(rootKey);
  if (rootMidi === null) return null;
  const thirdIndex = rootIndex + 2;
  const fifthIndex = rootIndex + 4;
  const seventhIndex = rootIndex + 6;
  const thirdLetter = letterOrder[thirdIndex % 7];
  const fifthLetter = letterOrder[fifthIndex % 7];
  const seventhLetter = letterOrder[seventhIndex % 7];
  const thirdOctave = rootOctave + Math.floor(thirdIndex / 7);
  const fifthOctave = rootOctave + Math.floor(fifthIndex / 7);
  const seventhOctave = rootOctave + Math.floor(seventhIndex / 7);
  const thirdKey = `${thirdLetter.toLowerCase()}/${thirdOctave}`;
  const fifthKey = `${fifthLetter.toLowerCase()}/${fifthOctave}`;
  const seventhKey = `${seventhLetter.toLowerCase()}/${seventhOctave}`;
  const thirdMidi = noteKeyToMidi(thirdKey);
  const fifthMidi = noteKeyToMidi(fifthKey);
  const seventhMidi = noteKeyToMidi(seventhKey);
  if (thirdMidi === null || fifthMidi === null || seventhMidi === null) return null;
  const targetThird = quality === "mol" ? 3 : 4;
  const targetFifth = 7;
  const targetSeventh = quality === "mol" ? 10 : 11;
  const thirdDelta = targetThird - (thirdMidi - rootMidi);
  const fifthDelta = targetFifth - (fifthMidi - rootMidi);
  const seventhDelta = targetSeventh - (seventhMidi - rootMidi);
  const accidentalForDelta = (delta) => (delta === 1 ? "#" : delta === -1 ? "b" : null);
  if (![-1, 0, 1].includes(thirdDelta) || ![-1, 0, 1].includes(fifthDelta) || ![-1, 0, 1].includes(seventhDelta)) {
    return null;
  }
  return {
    keys: [rootKey, thirdKey, fifthKey, seventhKey],
    accidentals: [null, accidentalForDelta(thirdDelta), accidentalForDelta(fifthDelta), accidentalForDelta(seventhDelta)],
  };
}

function generateSeventhQuestion(test) {
  const clefOptions = test.clef === "mixed" ? ["treble", "bass"] : [test.clef];
  const clef = pickClef(clefOptions, test.level);
  const pool = getPool(clef, test.level);
  const roots = Array.isArray(test.seventhRoots) && test.seventhRoots.length
    ? test.seventhRoots
    : ["C", "D", "E", "F", "G", "A", "B"];
  const qualities = ["dur", "mol"];
  let attempts = 0;
  let root = null;
  let chord = null;
  let quality = null;
  const rootCandidates = pool.filter((entry) => roots.includes(entry.letter));
  const selectionPool = rootCandidates.length ? rootCandidates : pool;
  while (attempts < 60 && !chord) {
    attempts += 1;
    const candidate = randomItem(selectionPool);
    const chosenQuality = randomItem(qualities);
    const built = buildSeventhNotes(candidate.key, chosenQuality);
    if (built) {
      root = candidate;
      chord = built;
      quality = chosenQuality;
    }
  }
  if (!chord) {
    root = selectionPool[0];
    quality = "dur";
    chord = buildSeventhNotes(root.key, quality);
  }
  const chordName = formatSeventhName(root.letter, quality);
  const options = buildSeventhOptions(chordName, roots, qualities);
  const correctIndex = options.indexOf(chordName);

  return {
    id: `q-${questionId++}`,
    type: "CHORD",
    mode: "QUIZ",
    topic: test.topic,
    clef,
    keySig: "C",
    notes: chord.keys.map((key) => ({ key })),
    accidentals: chord.accidentals,
    prompt: "Which chord is shown?",
    options,
    correctIndex,
    explanation: `Correct: ${chordName}.`,
  };
}

function generateTonalityQuestion(test) {
  const keyPool = Array.isArray(test.keySigs) && test.keySigs.length
    ? test.keySigs
    : ["C", "G", "F", "D", "Bb"];
  const keySig = randomItem(keyPool);
  const tonal = TONALITY_MAP[keySig] || TONALITY_MAP.C;
  const askMajor = Math.random() < 0.5;
  const majors = keyPool.map((key) => (TONALITY_MAP[key] || TONALITY_MAP.C).major);
  const minors = keyPool.map((key) => (TONALITY_MAP[key] || TONALITY_MAP.C).minor);
  const pool = askMajor ? majors : minors;
  const correctLabel = askMajor ? tonal.major : tonal.minor;
  const optionsSet = new Set([correctLabel]);
  while (optionsSet.size < QUIZ_OPTION_COUNT && optionsSet.size < pool.length) {
    optionsSet.add(randomItem(pool));
  }
  const options = shuffle(Array.from(optionsSet));
  const correctIndex = options.indexOf(correctLabel);

  return {
    id: `q-${questionId++}`,
    type: "KEY",
    mode: "QUIZ",
    topic: test.topic,
    clef: "treble",
    keySig,
    notes: [],
    prompt: askMajor ? "Koji je dur?" : "Koji je mol?",
    options,
    correctIndex,
    explanation: `Correct: ${correctLabel}.`,
  };
}

function generateParallelQuestion(test) {
  const keyPool = Array.isArray(test.keySigs) && test.keySigs.length
    ? test.keySigs
    : ["C", "G", "F", "D", "Bb"];
  const keySig = randomItem(keyPool);
  const tonal = TONALITY_MAP[keySig] || TONALITY_MAP.C;
  const askMinor = Math.random() < 0.5;
  const prompt = askMinor
    ? `Koji je paralelni mol od ${tonal.major}?`
    : `Koji je paralelni dur od ${tonal.minor}?`;
  const majors = keyPool.map((key) => (TONALITY_MAP[key] || TONALITY_MAP.C).major);
  const minors = keyPool.map((key) => (TONALITY_MAP[key] || TONALITY_MAP.C).minor);
  const pool = askMinor ? minors : majors;
  const correctLabel = askMinor ? tonal.minor : tonal.major;
  const optionsSet = new Set([correctLabel]);
  while (optionsSet.size < QUIZ_OPTION_COUNT && optionsSet.size < pool.length) {
    optionsSet.add(randomItem(pool));
  }
  const options = shuffle(Array.from(optionsSet));
  const correctIndex = options.indexOf(correctLabel);

  return {
    id: `q-${questionId++}`,
    type: "PARALLEL",
    mode: "QUIZ",
    topic: test.topic,
    clef: "treble",
    keySig,
    notes: [],
    prompt,
    options,
    correctIndex,
    explanation: `Correct: ${correctLabel}.`,
  };
}

function getTheoryPool(setName) {
  if (setName === "basics") {
    return THEORY_QUESTIONS.filter((item) => ["scale", "legato", "ligature"].includes(item.id));
  }
  if (setName === "tempo") {
    return THEORY_QUESTIONS.filter((item) => ["adagio", "lento"].includes(item.id));
  }
  return THEORY_QUESTIONS;
}

function buildTheoryOptions(correctAnswer, pool) {
  const options = new Set([correctAnswer]);
  while (options.size < QUIZ_OPTION_COUNT && options.size < pool.length) {
    options.add(randomItem(pool).answer);
  }
  return shuffle(Array.from(options)).slice(0, QUIZ_OPTION_COUNT);
}

function generateTheoryQuestion(test) {
  const pool = getTheoryPool(test.theorySet);
  const item = randomItem(pool);
  const options = buildTheoryOptions(item.answer, pool);
  const correctIndex = options.indexOf(item.answer);

  return {
    id: `q-${questionId++}`,
    type: "THEORY",
    mode: "QUIZ",
    topic: test.topic,
    clef: "treble",
    keySig: "C",
    notes: [],
    prompt: item.question,
    options,
    correctIndex,
    explanation: `Correct: ${item.answer}.`,
  };
}

function generateMinorModeQuestion(test) {
  const modeOptions = ["prirodni mol", "harmonijski mol", "melodijski mol"];
  const keyPool = Array.isArray(test.minorKeys) && test.minorKeys.length
    ? test.minorKeys
    : Object.keys(MINOR_MODE_KEYS);
  const minorKey = randomItem(keyPool);
  const config = MINOR_MODE_KEYS[minorKey] || MINOR_MODE_KEYS["A-mol"];
  const mode = randomItem(modeOptions);
  const notes = [];
  const accidentals = [];
  if (mode === "harmonijski mol") {
    notes.push({ key: config.raised7.key });
    accidentals.push(config.raised7.accidental);
  } else if (mode === "melodijski mol") {
    notes.push({ key: config.raised6.key }, { key: config.raised7.key });
    accidentals.push(config.raised6.accidental, config.raised7.accidental);
  }
  const options = shuffle([...modeOptions]);
  const correctIndex = options.indexOf(mode);

  return {
    id: `q-${questionId++}`,
    type: "MINOR_MODE",
    mode: "QUIZ",
    topic: test.topic,
    clef: "treble",
    keySig: config.keySig,
    notes,
    accidentals,
    prompt: `Koji je tip ${minorKey}?`,
    options,
    correctIndex,
    explanation: `Correct: ${mode}.`,
  };
}
