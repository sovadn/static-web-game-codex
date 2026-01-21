const state = {
  currentQuestion: null,
  inputLocked: false,
  mode: "quiz",
  feedbackTimer: null,
  settings: null,
  progress: null,
  currentTestId: null,
  testIndex: 0,
  correctCount: 0,
  testActive: false,
  testCategory: null,
};

window.__gameState = state;

const ui = {
  notation: document.getElementById("notation"),
  notationCard: document.getElementById("notationCard"),
  prompt: document.getElementById("promptText"),
  feedback: document.getElementById("feedback"),
  lanes: Array.from(document.querySelectorAll(".lane")),
  restart: document.getElementById("restartButton"),
  quizMode: document.getElementById("quizMode"),
  rosettaMode: document.getElementById("rosettaMode"),
  testToggle: document.getElementById("testToggle"),
  testPanel: document.getElementById("testPanel"),
  testList: document.getElementById("testList"),
  testBack: document.getElementById("testBack"),
  testStatus: document.getElementById("testStatus"),
  questionProgress: document.getElementById("questionProgress"),
  scoreProgress: document.getElementById("scoreProgress"),
};

const STORAGE_KEYS = {
  progress: "solffeggioTestProgress",
  settings: "solffeggioTestSettings",
};

const TEST_QUESTION_COUNT = 10;
const UNLOCK_SCORE = 8;

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

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.settings);
    if (!raw) return { lastTestId: null };
    const parsed = JSON.parse(raw);
    return { lastTestId: typeof parsed.lastTestId === "string" ? parsed.lastTestId : null };
  } catch {
    return { lastTestId: null };
  }
}

function saveSettings() {
  if (!state.settings) return;
  localStorage.setItem(STORAGE_KEYS.settings, JSON.stringify(state.settings));
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.progress);
    if (!raw) return { tests: {} };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { tests: {} };
  } catch {
    return { tests: {} };
  }
}

function saveProgress() {
  if (!state.progress) return;
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(state.progress));
}

function getTestProgress(testId) {
  if (!state.progress.tests[testId]) {
    state.progress.tests[testId] = { best: 0, attempts: 0 };
  }
  return state.progress.tests[testId];
}

function isTestUnlocked(test) {
  if (test.order === 1) return true;
  const previous = TESTS.find((item) => item.track === test.track && item.order === test.order - 1);
  if (!previous) return true;
  const prevProgress = getTestProgress(previous.id);
  return prevProgress.best >= UNLOCK_SCORE;
}

function updateTestListUi() {
  if (!ui.testList) return;
  ui.testList.innerHTML = "";
  if (!state.testCategory) {
    TEST_CATEGORIES.forEach((category) => {
      const item = document.createElement("div");
      item.className = "test-category";
      item.innerHTML = `
        <div>
          <div class="test-category-title">${category.label}</div>
          <div class="test-category-sub">${category.description}</div>
        </div>
        <div class="progress-score">Otvori</div>
      `;
      item.addEventListener("click", () => {
        state.testCategory = category.id;
        updateTestListUi();
      });
      ui.testList.appendChild(item);
    });
    if (ui.testBack) {
      ui.testBack.classList.add("hidden");
    }
    return;
  }

  const filtered = TESTS.filter((test) => test.track === state.testCategory);
  filtered.forEach((test) => {
    const progress = getTestProgress(test.id);
    const unlocked = isTestUnlocked(test);
    const card = document.createElement("div");
    const isActive = test.id === state.currentTestId;
    card.className = `test-card${unlocked ? "" : " locked"}${isActive ? " active" : ""}`;
    card.innerHTML = `
      <div class="progress-meta">
        <div>${test.label}</div>
        <div class="progress-status">Najbolje: ${progress.best}/${TEST_QUESTION_COUNT}</div>
      </div>
    `;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = unlocked ? "Pokreni" : "Zaključano";
    button.disabled = !unlocked;
    button.addEventListener("click", () => startTest(test.id));
    card.appendChild(button);
    ui.testList.appendChild(card);
  });
  if (ui.testBack) {
    ui.testBack.classList.remove("hidden");
  }
}

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

let questionId = 0;
const QUIZ_OPTION_COUNT = 3;
const ROSETTA_OPTION_COUNT = 4;

function init() {
  state.settings = loadSettings();
  state.progress = loadProgress();
  ui.lanes.forEach((lane) => {
    lane.addEventListener("click", () => handleAnswer(Number(lane.dataset.index)));
  });
  if (ui.quizMode && ui.rosettaMode) {
    ui.quizMode.addEventListener("click", () => switchMode("quiz"));
    ui.rosettaMode.addEventListener("click", () => switchMode("rosettaStone"));
  }
  if (ui.testToggle && ui.testPanel) {
    ui.testToggle.addEventListener("click", () => {
      const isOpen = document.body.classList.toggle("show-tests");
      ui.testPanel.classList.toggle("hidden", !isOpen);
      if (isOpen) {
        state.testCategory = null;
        updateTestListUi();
      }
    });
  }
  if (ui.testBack) {
    ui.testBack.addEventListener("click", () => {
      state.testCategory = null;
      updateTestListUi();
    });
  }
  ui.restart.addEventListener("click", () => {
    if (state.currentTestId) startTest(state.currentTestId);
  });
  document.addEventListener("keydown", (event) => {
    if (state.inputLocked) return;
    const key = event.key;
    if (key === "1" || key === "2" || key === "3") {
      handleAnswer(Number(key) - 1);
    } else if (key === "4" && state.mode === "rosettaStone") {
      handleAnswer(3);
    }
  });
  waitForVexFlow().then((ready) => {
    if (!ready) {
      ui.feedback.textContent =
        "Notation engine failed to load. Please refresh, or disable tracking prevention for this site.";
      ui.lanes.forEach((lane) => (lane.disabled = true));
      return;
    }
    updateModeUi(state.mode);
    updateTestListUi();
    const defaultTestId = getDefaultTestId();
    state.currentTestId = state.settings.lastTestId || defaultTestId;
    const currentTest = getTestById(state.currentTestId);
    if (!currentTest || !isTestUnlocked(currentTest)) {
      state.currentTestId = defaultTestId;
    }
    startTest(state.currentTestId);
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

function getTestById(testId) {
  return TESTS.find((test) => test.id === testId) || null;
}

function getDefaultTestId() {
  const defaultTest = TESTS.find((test) => test.track === "note-treble" && test.order === 1);
  return defaultTest ? defaultTest.id : TESTS[0].id;
}

function updateTestStatus() {
  const test = getTestById(state.currentTestId);
  if (ui.testStatus) {
    ui.testStatus.textContent = test ? `Test: ${test.label}` : "Test: -";
  }
  if (ui.questionProgress) {
    const currentIndex = state.testActive
      ? Math.min(state.testIndex + 1, TEST_QUESTION_COUNT)
      : Math.min(state.testIndex, TEST_QUESTION_COUNT);
    ui.questionProgress.textContent = `Pitanje ${currentIndex}/${TEST_QUESTION_COUNT}`;
  }
  if (ui.scoreProgress) {
    ui.scoreProgress.textContent = `Točno ${state.correctCount}/${TEST_QUESTION_COUNT}`;
  }
}

function startTest(testId) {
  const test = getTestById(testId);
  if (!test) return;
  state.currentTestId = testId;
  state.settings.lastTestId = testId;
  saveSettings();
  state.testIndex = 0;
  state.correctCount = 0;
  state.testActive = true;
  state.inputLocked = false;
  document.body.classList.remove("show-tests");
  if (ui.testPanel) ui.testPanel.classList.add("hidden");
  ui.restart.textContent = "Ponovi test";
  ui.restart.classList.add("hidden");
  updateTestStatus();
  updateTestListUi();
  ui.feedback.textContent = "";
  nextQuestion();
}

function finishTest() {
  state.testActive = false;
  const progress = getTestProgress(state.currentTestId);
  progress.attempts += 1;
  progress.best = Math.max(progress.best, state.correctCount);
  saveProgress();
  updateTestListUi();
  updateTestStatus();
  ui.feedback.textContent = `Test završen: ${state.correctCount}/${TEST_QUESTION_COUNT}.`;
  ui.restart.textContent = "Ponovi test";
  ui.restart.classList.remove("hidden");
}

function updateModeUi(mode) {
  if (!ui.quizMode || !ui.rosettaMode) return;
  ui.quizMode.classList.toggle("active", mode === "quiz");
  ui.rosettaMode.classList.toggle("active", mode === "rosettaStone");
  ui.quizMode.setAttribute("aria-selected", String(mode === "quiz"));
  ui.rosettaMode.setAttribute("aria-selected", String(mode === "rosettaStone"));
}

function switchMode(mode) {
  state.mode = mode;
  updateModeUi(mode);
  state.inputLocked = false;
  if (state.testActive) {
    renderQuestion(state.currentQuestion);
  }
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

function randomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
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

function generateNoteQuestion(test) {
  const clefOptions = test.clef === "mixed" ? ["treble", "bass"] : [test.clef];
  const clef = pickClef(clefOptions, test.level);
  const keySig = randomItem(keyPoolByLevel[test.level]);
  const pool = getNotePoolForTest(test, clef);
  const note = randomItem(pool);
  const applied = applyKeySignature(note.letter, keySig);
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
    explanation: `Correct: ${correctName} (in ${keySig} major, ${note.letter} is ${
      applied.accidental === "#" ? "sharpened" : applied.accidental === "b" ? "flattened" : "natural"
    }).`,
  };
}

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

function generateRosettaQuestion(test) {
  const clefOptions = test.clef === "mixed" ? ["treble", "bass"] : [test.clef];
  const clef = pickClef(clefOptions, test.level);
  const keySig = randomItem(keyPoolByLevel[test.level]);
  const pool = getNotePoolForTest(test, clef);
  const note = randomItem(pool);
  const { options, optionNoteKeys, correctIndex } = buildNoteOptions({
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
    explanation: `Correct: ${intervalName}. Count the staff steps from ${lower.letter} to ${upper.letter}.`,
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

function shuffle(list) {
  const copy = [...list];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
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

function formatChordName(letter, quality) {
  if (!letter) return "";
  const base = letter === "B" ? "H" : letter;
  return quality === "mol" ? `${base}-mol` : `${base}-dur`;
}

function formatSeventhName(letter, quality) {
  if (!letter) return "";
  const base = letter === "B" ? "H" : letter;
  return quality === "mol" ? `${base}-mol7` : `${base}-dur7`;
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
  if (![ -1, 0, 1 ].includes(thirdDelta) || ![ -1, 0, 1 ].includes(fifthDelta)) {
    return null;
  }
  const accidentalForDelta = (delta) => (delta === 1 ? "#" : delta === -1 ? "b" : null);
  return {
    keys: [rootKey, thirdKey, fifthKey],
    accidentals: [null, accidentalForDelta(thirdDelta), accidentalForDelta(fifthDelta)],
  };
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
  if (![ -1, 0, 1 ].includes(thirdDelta) || ![ -1, 0, 1 ].includes(fifthDelta) || ![ -1, 0, 1 ].includes(seventhDelta)) {
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

function generateTonalityQuestion(test) {
  const keyPool = Array.isArray(test.keySigs) && test.keySigs.length
    ? test.keySigs
    : ["C", "G", "F", "D", "Bb"];
  const keySig = randomItem(keyPool);
  const tonal = TONALITY_MAP[keySig] || TONALITY_MAP.C;
  const askMajor = Math.random() < 0.5;
  const options = shuffle([tonal.major, tonal.minor]);
  const correctLabel = askMajor ? tonal.major : tonal.minor;
  const correctIndex = options.indexOf(correctLabel);

  return {
    id: `q-${questionId++}`,
    type: "KEY",
    mode: "QUIZ",
    topic: test.topic,
    clef: "treble",
    keySig,
    notes: [],
    prompt: askMajor ? "Koji je dur?" : "Koji je paralelni mol?",
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
  const options = shuffle([tonal.major, tonal.minor]);
  const correctLabel = askMinor ? tonal.minor : tonal.major;
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

let audioCtx = null;

function getAudioContext() {
  if (!audioCtx) {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return null;
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

function noteKeyToFrequency(noteKey, keySig) {
  if (!noteKey) return 440;
  const [rawLetter, rawOctave] = String(noteKey).split("/");
  const letter = rawLetter.toLowerCase();
  const octave = Number(rawOctave);
  const semitoneByLetter = { c: 0, d: 2, e: 4, f: 5, g: 7, a: 9, b: 11 };
  let semitone = semitoneByLetter[letter];
  if (semitone === undefined || Number.isNaN(octave)) return 440;
  const accidental = keySignatures[keySig]?.[letter.toUpperCase()] || "";
  if (accidental === "#") semitone += 1;
  if (accidental === "b") semitone -= 1;
  const midi = (octave + 1) * 12 + semitone;
  return 440 * Math.pow(2, (midi - 69) / 12);
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

function playPianoNote(noteKey, keySig) {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "triangle";
  osc.frequency.value = noteKeyToFrequency(noteKey, keySig);
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.22, now + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.5);
}

function playSuccessTone() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  const now = ctx.currentTime;
  const freqs = [523.25, 659.25, 783.99];
  freqs.forEach((freq, index) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sine";
    osc.frequency.value = freq;
    const start = now + index * 0.02;
    gain.gain.setValueAtTime(0, start);
    gain.gain.linearRampToValueAtTime(0.18, start + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, start + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(start);
    osc.stop(start + 0.32);
  });
}

function playErrorTone() {
  const ctx = getAudioContext();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  const now = ctx.currentTime;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sawtooth";
  osc.frequency.value = 180;
  gain.gain.setValueAtTime(0, now);
  gain.gain.linearRampToValueAtTime(0.18, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(now);
  osc.stop(now + 0.28);
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
  const width = containerEl.clientWidth || 220;
  const height = containerEl.clientHeight || 130;
  renderer.resize(width, height);
  const context = renderer.getContext();
  const scale = 0.9;
  context.scale(scale, scale);
  const scaledWidth = width / scale;
  const scaledHeight = height / scale;
  const staffWidth = Math.max(180, Math.min(scaledWidth - 24, 240));
  const staffX = Math.max(12, (scaledWidth - staffWidth) / 2);
  const staffY = Math.max(16, (scaledHeight - 90) / 2);
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
    svg.setAttribute("viewBox", `0 0 ${width} ${height}`);
  }
}

function getNextQuestion() {
  const test = getTestById(state.currentTestId) || TESTS[0];
  if (state.mode === "rosettaStone" && test.topic === "note") {
    return generateRosettaQuestion(test);
  }
  if (test.topic === "interval-basic") {
    return generateIntervalQuestion(test);
  }
  if (test.topic === "interval-advanced") {
    return generateIntervalQuestion(test);
  }
  if (test.topic === "triad") {
    return generateTriadQuestion(test);
  }
  if (test.topic === "seventh") {
    return generateSeventhQuestion(test);
  }
  if (test.topic === "tonality") {
    return generateTonalityQuestion(test);
  }
  if (test.topic === "parallel") {
    return generateParallelQuestion(test);
  }
  if (test.topic === "minor-mode") {
    return generateMinorModeQuestion(test);
  }
  if (test.topic === "theory") {
    return generateTheoryQuestion(test);
  }
  return generateNoteQuestion(test);
}

function nextQuestion() {
  if (!state.testActive) return;
  if (state.testIndex >= TEST_QUESTION_COUNT) {
    finishTest();
    return;
  }
  state.currentQuestion = getNextQuestion();
  renderQuestion(state.currentQuestion);
  updateTestStatus();
}

function renderQuestion(question) {
  ui.prompt.textContent = question.prompt;
  document.body.classList.toggle("mode-rosetta", question.mode === "ROSETTA");
  document.body.classList.toggle("mode-quiz", question.mode === "QUIZ");
  ui.lanes.forEach((lane, index) => {
    if (question.mode === "QUIZ" && index >= QUIZ_OPTION_COUNT) {
      lane.style.display = "none";
      lane.classList.add("hidden");
      lane.disabled = true;
      setLaneLabel(lane, "");
      clearLaneNotation(lane);
      return;
    }
    lane.style.removeProperty("display");
    const option = question.options[index];
    if (option === undefined) {
      lane.classList.add("hidden");
      lane.disabled = true;
      return;
    }
    lane.classList.remove("hidden");
    lane.classList.toggle("lane-text-only", question.mode === "QUIZ");
    lane.classList.toggle("lane-label-hidden", question.mode === "ROSETTA");
    setLaneLabel(lane, option);
    if (question.mode === "ROSETTA" && question.optionNoteKeys) {
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
  if (question.mode !== "ROSETTA") {
    renderNotation(question);
  } else {
    ui.notation.innerHTML = "";
  }
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
  if (question.type === "KEY") {
    notes = [];
  } else if (question.type === "NOTE") {
    notes = [new VF.StaveNote({ clef: question.clef, keys: [question.notes[0].key], duration: "q" })];
  } else if (question.type === "INTERVAL") {
    notes = [
      new VF.StaveNote({
        clef: question.clef,
        keys: [question.notes[0].key, question.notes[1].key],
        duration: "q",
      }),
    ];
  } else if (question.type === "MINOR_MODE") {
    if (!question.notes || question.notes.length === 0) {
      notes = [];
    } else {
      notes = [
        new VF.StaveNote({
          clef: question.clef,
          keys: question.notes.map((note) => note.key),
          duration: "q",
        }),
      ];
    }
  } else {
    notes = [
      new VF.StaveNote({
        clef: question.clef,
        keys: question.notes.map((note) => note.key),
        duration: "q",
      }),
    ];
  }
  notes.forEach((note) => note.setStave(stave));

  if (question.accidentals && notes[0]) {
    question.accidentals.forEach((accidental, index) => {
      if (accidental) {
        notes[0].addModifier(new VF.Accidental(accidental), index);
      }
    });
  }

  if (notes.length > 0) {
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
      context.setFillStyle("rgba(245, 158, 11, 0.22)");
      ys.forEach((y) => {
        context.beginPath();
        context.arc(x, y, 12, 0, Math.PI * 2);
        context.fill();
      });
      context.restore();
    });

    voice.draw(context, stave);
  }
}

function handleAnswer(index) {
  if (state.inputLocked || !state.currentQuestion || !state.testActive) return;
  if (index >= state.currentQuestion.options.length) return;
  state.inputLocked = true;
  ui.lanes.forEach((lane) => (lane.disabled = true));
  const correct = index === state.currentQuestion.correctIndex;
  if (correct) {
    playSuccessTone();
  } else {
    playErrorTone();
  }

  if (correct) {
    state.correctCount += 1;
  }

  const feedbackText = correct
    ? state.currentQuestion.explanation
    : `Wrong. ${state.currentQuestion.explanation}`;
  ui.feedback.textContent = feedbackText;
  if (state.feedbackTimer) {
    clearTimeout(state.feedbackTimer);
    state.feedbackTimer = null;
  }
  ui.notationCard.classList.remove("correct", "wrong");
  void ui.notationCard.offsetWidth;
  ui.notationCard.classList.add(correct ? "correct" : "wrong");

  state.feedbackTimer = setTimeout(() => {
    ui.notationCard.classList.remove("correct", "wrong");
    state.feedbackTimer = null;
  }, 550);

  state.testIndex += 1;
  updateTestStatus();

  setTimeout(() => {
    if (state.testIndex >= TEST_QUESTION_COUNT) {
      finishTest();
    } else {
      nextQuestion();
    }
  }, 950);
}

init();






