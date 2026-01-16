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
  const accidentalSymbol = accidental === "#" ? "\u266F" : accidental === "b" ? "\u266D" : "";
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
  const { options, optionNoteKeys, correctIndex } = buildNoteOptions({
    pool,
    keySig,
    baseNote: note,
  });

  return {
    id: `q-${questionId++}`,
    type: "NOTE",
    clef,
    keySig,
    notes: [note],
    prompt: "Which note is shown?",
    options,
    optionNoteKeys,
    correctIndex,
    explanation: `Correct: ${correctName} (in ${keySig} major, ${note.letter} is ${
      applied.accidental === "#" ? "sharpened" : applied.accidental === "b" ? "flattened" : "natural"
    }).`,
  };
}

function buildNoteOptions({ pool, keySig, baseNote }) {
  const baseIndex = Math.max(0, pool.findIndex((entry) => entry.key === baseNote.key));
  const indices = [];
  let step = 0;
  while (indices.length < 3 && (baseIndex - step >= 0 || baseIndex + step < pool.length)) {
    if (step === 0) {
      indices.push(baseIndex);
    } else {
      if (baseIndex - step >= 0) indices.push(baseIndex - step);
      if (indices.length < 3 && baseIndex + step < pool.length) indices.push(baseIndex + step);
    }
    step += 1;
  }

  const entries = indices.map((index) => pool[index]).filter(Boolean);
  const optionEntries = shuffle(entries).slice(0, 3);
  const optionNoteKeys = optionEntries.map((entry) => entry.key);
  const options = optionEntries.map((entry) => {
    const applied = applyKeySignature(entry.letter, keySig);
    return formatNoteName(applied.letter, applied.accidental);
  });
  const correctIndex = optionEntries.findIndex((entry) => entry.key === baseNote.key);

  return { options, optionNoteKeys, correctIndex };
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

function setLaneLabel(lane, text) {
  const label = lane.querySelector(".lane-label");
  if (label) {
    label.textContent = text;
  }
}

function clearLaneNotation(lane) {
  const container = lane.querySelector(".lane-notation");
  if (container) {
    container.innerHTML = "";
  }
}

function renderLaneNotation({ containerEl, clef, keySig, noteKey }) {
  if (!containerEl) return;
  const VF = getVexFlow();
  if (!VF) return;

  containerEl.innerHTML = "";
  const renderer = new VF.Renderer(containerEl, VF.Renderer.Backends.SVG);
  const width = containerEl.clientWidth || 200;
  const height = containerEl.clientHeight || 120;
  renderer.resize(width, height);
  const context = renderer.getContext();
  const staffWidth = Math.max(160, Math.min(width - 16, 220));
  const staffX = Math.max(6, (width - staffWidth) / 2);
  const staffY = 18;
  const stave = new VF.Stave(staffX, staffY, staffWidth);
  stave.addClef(clef).addKeySignature(keySig);
  stave.setContext(context).draw();

  const note = new VF.StaveNote({ clef, keys: [noteKey], duration: "q" });
  note.setStave(stave);
  const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
  voice.addTickables([note]);
  new VF.Formatter().joinVoices([voice]).format([voice], staffWidth - 30);
  voice.draw(context, stave);

  const svg = containerEl.querySelector("svg");
  if (svg) {
    svg.setAttribute("preserveAspectRatio", "xMidYMid meet");
  }
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
    lane.classList.toggle("lane-text-only", question.type !== "NOTE");
    setLaneLabel(lane, question.options[index]);
    if (question.type === "NOTE" && question.optionNoteKeys) {
      const container = lane.querySelector(".lane-notation");
      renderLaneNotation({
        containerEl: container,
        clef: question.clef,
        keySig: question.keySig,
        noteKey: question.optionNoteKeys[index],
      });
    } else {
      clearLaneNotation(lane);
    }
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
  // Scale and shorten the staff on small screens for legibility and reduced eye travel.
  const isMobile = window.innerWidth <= 600;
  const cardWidth = ui.notationCard.clientWidth || ui.notation.clientWidth || 320;
  const targetWidth = cardWidth;
  const targetHeight = isMobile ? 260 : 220;
  const scale = isMobile ? 1.6 : 1.45;
  renderer.resize(targetWidth, targetHeight);
  const context = renderer.getContext();
  context.scale(scale, scale);
  const scaledWidth = targetWidth / scale;
  const scaledHeight = targetHeight / scale;
  const staffWidth = isMobile
    ? Math.max(180, Math.min(220, scaledWidth - 20))
    : Math.max(220, Math.min(340, scaledWidth - 24));
  const staffX = Math.max(8, (scaledWidth - staffWidth) / 2);
  const staffY = Math.max(26, (scaledHeight - 90) / 2);
  const stave = new VF.Stave(staffX, staffY, staffWidth);
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
  notes.forEach((note) => note.setStave(stave));

  const voice = new VF.Voice({ num_beats: 1, beat_value: 4 });
  voice.addTickables(notes);
  const formatterWidth = Math.max(120, staffWidth - 40);
  new VF.Formatter().joinVoices([voice]).format([voice], formatterWidth);

  // Soft halo around noteheads to help the eye lock onto the target quickly.
  notes.forEach((note) => {
    const ys = note.getYs();
    const x = note.getAbsoluteX();
    if (!ys || !ys.length) return;
    context.save();
    context.setFillStyle("rgba(79, 70, 229, 0.18)");
    ys.forEach((y) => {
      context.beginPath();
      context.arc(x, y, 12, 0, Math.PI * 2);
      context.fill();
    });
    context.restore();
  });

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





