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
    if (ui.testBack) ui.testBack.classList.add("hidden");
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
  if (ui.testBack) ui.testBack.classList.remove("hidden");
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

  if (correct) {
    state.correctCount += 1;
  }

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
