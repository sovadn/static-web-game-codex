const state = {
  army: 10,
  combo: 0,
  level: 1,
  bossActive: false,
  bossHp: 30,
  questionCount: 0,
  currentQuestion: null,
  retryQueue: [],
  inputLocked: false,
};

window.__gameState = state;

const ui = {
  army: document.getElementById("armyValue"),
  combo: document.getElementById("comboValue"),
  level: document.getElementById("levelValue"),
  boss: document.getElementById("bossValue"),
  bossStat: document.getElementById("bossStat"),
  notation: document.getElementById("notation"),
  notationCard: document.getElementById("notationCard"),
  prompt: document.getElementById("promptText"),
  feedback: document.getElementById("feedback"),
  lanes: Array.from(document.querySelectorAll(".lane")),
  restart: document.getElementById("restartButton"),
};

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
    ],
  },
  bass: {
    level1: [
      { key: "g/2", letter: "G" },
      { key: "a/2", letter: "A" },
      { key: "b/2", letter: "B" },
      { key: "c/3", letter: "C" },
      { key: "d/3", letter: "D" },
      { key: "e/3", letter: "E" },
      { key: "f/3", letter: "F" },
      { key: "g/3", letter: "G" },
      { key: "a/3", letter: "A" },
    ],
    level2: [
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
    ],
  },
};

const letters = ["A", "B", "C", "D", "E", "F", "G"];
const intervalNames = {
  1: "2nd",
  2: "3rd",
  3: "4th",
  4: "5th",
};

const keyPoolByLevel = {
  1: ["C", "G", "F"],
  2: ["C", "G", "F", "D", "Bb"],
};

let questionId = 0;

function init() {
  ui.lanes.forEach((lane) => {
    lane.addEventListener("click", () => handleAnswer(Number(lane.dataset.index)));
  });
  ui.restart.addEventListener("click", restartGame);
  document.addEventListener("keydown", (event) => {
    if (state.inputLocked) return;
    const key = event.key;
    if (key === "1" || key === "2" || key === "3") {
      handleAnswer(Number(key) - 1);
    }
  });
  waitForVexFlow().then((ready) => {
    if (!ready) {
      ui.feedback.textContent =
        "Notation engine failed to load. Please refresh, or disable tracking prevention for this site.";
      ui.lanes.forEach((lane) => (lane.disabled = true));
      return;
    }
    startGame();
  });
}

function getVexFlow() {
  if (window.VexFlow) {
    return window.VexFlow;
  }
  if (window.Vex && window.Vex.Flow) {
    return window.Vex.Flow;
  }
  return null;
}

function loadVexFlowScript(src) {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = () => resolve(Boolean(getVexFlow()));
    script.onerror = () => resolve(false);
    document.head.appendChild(script);
  });
}

async function waitForVexFlow() {
  if (getVexFlow()) {
    return true;
  }
  const sources = [
    "./vendor/vexflow-min.js",
    "https://unpkg.com/vexflow@4.2.5/releases/vexflow-min.js",
    "https://cdn.jsdelivr.net/npm/vexflow@4.2.5/releases/vexflow-min.js",
  ];

  for (const src of sources) {
    const loaded = await loadVexFlowScript(src);
    if (loaded) {
      return true;
    }
  }

  let attempts = 0;
  return new Promise((resolve) => {
    const check = () => {
      if (getVexFlow()) {
        resolve(true);
        return;
      }
      attempts += 1;
      if (attempts >= 10) {
        resolve(false);
        return;
      }
      setTimeout(check, 150);
    };
    check();
  });
}

function startGame() {
  state.army = 10;
  state.combo = 0;
  state.level = 1;
  state.bossActive = false;
  state.bossHp = 30;
  state.questionCount = 0;
  state.retryQueue = [];
  state.inputLocked = false;
  ui.restart.classList.add("hidden");
  updateStats();
  nextQuestion();
}

function restartGame() {
  ui.feedback.textContent = "Back in formation!";
  startGame();
}

function updateStats() {
  ui.army.textContent = state.army;
  ui.combo.textContent = state.combo;
  ui.level.textContent = state.level;
  ui.boss.textContent = state.bossHp;
  ui.bossStat.classList.toggle("hidden", !state.bossActive);
}

function getPool(clef) {
  const levelKey = state.level === 1 ? "level1" : "level2";
  return notePools[clef][levelKey];
}

function applyKeySignature(letter, keySig) {
  const accidental = keySignatures[keySig][letter] || "";
  return { letter, accidental };
}

function formatNoteName(letter, accidental) {
  const accidentalSymbol = accidental === "#" ? "サ_" : accidental === "b" ? "サ-" : "";
  if (letter === "B") {
    if (accidental === "b") {
      return `B${accidentalSymbol}`;
    }
    return `H${accidentalSymbol}`;
  }
  return `${letter}${accidentalSymbol}`;
}

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function generateNoteQuestion() {
  const clef = state.level === 1 ? "treble" : Math.random() < 0.55 ? "treble" : "bass";
  const keySig = randomItem(keyPoolByLevel[state.level]);
  const pool = getPool(clef);
  const note = randomItem(pool);
  const applied = applyKeySignature(note.letter, keySig);
  const correctName = formatNoteName(applied.letter, applied.accidental);
  const options = buildNoteOptions(correctName, note.letter, applied.accidental);
  const correctIndex = options.indexOf(correctName);

  return {
    id: `q-${questionId++}`,
    type: "NOTE",
    clef,
    keySig,
    notes: [note],
    prompt: "Which note is shown?",
    options,
    correctIndex,
    explanation: `Correct: ${correctName} (in ${keySig} major, ${note.letter} is ${
      applied.accidental === "#" ? "sharpened" : applied.accidental === "b" ? "flattened" : "natural"
    }).`,
  };
}

function buildNoteOptions(correctName, baseLetter, accidental) {
  const options = new Set([correctName]);
  if (accidental) {
    options.add(formatNoteName(baseLetter, ""));
  } else {
    const fakeAccidental = baseLetter === "B" ? "b" : "#";
    options.add(formatNoteName(baseLetter, fakeAccidental));
  }
  const baseIndex = letters.indexOf(baseLetter);
  const adjacentLetter = letters[(baseIndex + 1) % letters.length];
  options.add(formatNoteName(adjacentLetter, ""));
  while (options.size < 3) {
    options.add(formatNoteName(randomItem(letters), ""));
  }
  return shuffle(Array.from(options)).slice(0, 3);
}

function generateIntervalQuestion() {
  const clef = state.level === 1 ? "treble" : Math.random() < 0.55 ? "treble" : "bass";
  const keySig = randomItem(keyPoolByLevel[state.level]);
  const pool = getPool(clef);
  const size = randomItem([1, 2, 3, 4]);
  let baseIndex = Math.floor(Math.random() * (pool.length - size));
  if (baseIndex < 0) baseIndex = 0;
  const lower = pool[baseIndex];
  const upper = pool[baseIndex + size];
  const intervalName = intervalNames[size];
  const options = buildIntervalOptions(intervalName);
  const correctIndex = options.indexOf(intervalName);

  return {
    id: `q-${questionId++}`,
    type: "INTERVAL",
    clef,
    keySig,
    notes: [lower, upper],
    prompt: "What interval is shown?",
    options,
    correctIndex,
    explanation: `Correct: ${intervalName}. Count the staff steps from ${lower.letter} to ${upper.letter}.`,
  };
}

function buildIntervalOptions(correctName) {
  const names = ["2nd", "3rd", "4th", "5th"];
  const options = new Set([correctName]);
  const index = names.indexOf(correctName);
  if (index > 0) options.add(names[index - 1]);
  if (index < names.length - 1) options.add(names[index + 1]);
  while (options.size < 3) {
    options.add(randomItem(names));
  }
  return shuffle(Array.from(options)).slice(0, 3);
}

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function getNextQuestion() {
  state.retryQueue.forEach((entry) => {
    entry.dueIn -= 1;
  });
  const dueIndex = state.retryQueue.findIndex((entry) => entry.dueIn <= 0);
  if (dueIndex >= 0) {
    const [entry] = state.retryQueue.splice(dueIndex, 1);
    return entry.question;
  }
  return Math.random() < 0.65 ? generateNoteQuestion() : generateIntervalQuestion();
}

function nextQuestion() {
  if (state.army <= 0) {
    endGame();
    return;
  }
  state.currentQuestion = getNextQuestion();
  renderQuestion(state.currentQuestion);
}

function renderQuestion(question) {
  ui.prompt.textContent = question.prompt;
  ui.lanes.forEach((lane, index) => {
    lane.textContent = question.options[index];
    lane.disabled = false;
  });
  ui.feedback.textContent = "";
  renderNotation(question);
  state.inputLocked = false;
}

function renderNotation(question) {
  ui.notation.innerHTML = "";
  const VF = getVexFlow();
  if (!VF) {
    ui.feedback.textContent = "Notation engine missing. Reload to continue.";
    return;
  }
  const renderer = new VF.Renderer(ui.notation, VF.Renderer.Backends.SVG);
  const width = ui.notation.clientWidth || 320;
  renderer.resize(width, 170);
  const context = renderer.getContext();
  const stave = new VF.Stave(8, 40, width - 16);
  stave.addClef(question.clef).addKeySignature(question.keySig);
  stave.setContext(context).draw();

  let notes;
  if (question.type === "NOTE") {
    notes = [new VF.StaveNote({ clef: question.clef, keys: [question.notes[0].key], duration: "q" })];
  } else {
    notes = [
      new VF.StaveNote({
        clef: question.clef,
        keys: [question.notes[0].key, question.notes[1].key],
        duration: "q",
      }),
    ];
  }

  const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
  voice.addTickables(notes);
  new VF.Formatter().joinVoices([voice]).format([voice], width - 50);
  voice.draw(context, stave);
}

function handleAnswer(index) {
  if (state.inputLocked || !state.currentQuestion) return;
  state.inputLocked = true;
  ui.lanes.forEach((lane) => (lane.disabled = true));
  const correct = index === state.currentQuestion.correctIndex;

  if (state.bossActive) {
    if (correct) {
      state.bossHp -= 6;
      state.combo += 1;
      state.army += 2;
    } else {
      state.army -= 8;
      state.combo = 0;
    }
  } else if (correct) {
    state.army += 2;
    state.combo += 1;
  } else {
    state.army -= 3;
    state.combo = 0;
  }

  if (!correct) {
    state.retryQueue.push({
      question: state.currentQuestion,
      dueIn: 2 + Math.floor(Math.random() * 4),
    });
  }

  const feedbackText = correct
    ? state.currentQuestion.explanation
    : `Wrong. ${state.currentQuestion.explanation}`;
  ui.feedback.textContent = feedbackText;
  ui.notationCard.classList.remove("correct", "wrong");
  ui.notationCard.classList.add(correct ? "correct" : "wrong");

  setTimeout(() => {
    ui.notationCard.classList.remove("correct", "wrong");
  }, 400);

  state.questionCount += 1;
  if (!state.bossActive && state.questionCount % 12 === 0) {
    startBoss();
  }

  if (state.bossActive && state.bossHp <= 0) {
    finishBoss();
  }

  updateStats();

  setTimeout(() => {
    if (state.army <= 0) {
      endGame();
    } else {
      nextQuestion();
    }
  }, 950);
}

function startBoss() {
  state.bossActive = true;
  state.bossHp = 30;
  ui.feedback.textContent = "Boss incoming! Break its rhythm shield.";
  updateStats();
}

function finishBoss() {
  state.bossActive = false;
  state.level = Math.min(2, state.level + 1);
  state.bossHp = 30;
  ui.feedback.textContent = "Boss defeated! Difficulty increased.";
  updateStats();
}

function endGame() {
  ui.feedback.textContent = "Game Over. The army fell. Try again!";
  ui.restart.classList.remove("hidden");
  ui.lanes.forEach((lane) => (lane.disabled = true));
  state.inputLocked = true;
}

init();




