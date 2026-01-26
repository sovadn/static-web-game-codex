const state = {
  currentQuestion: null,
  inputLocked: false,
  mode: "quiz",
  feedbackTimer: null,
  laneFeedbackTimer: null,
  retryQueue: [],
  questionSerial: 0,
  currentQuestionKey: null,
  currentQuestionFromRetry: false,
  settings: null,
  progress: null,
  curriculum: null,
  currentTestId: null,
  testIndex: 0,
  correctCount: 0,
  testActive: false,
  testCategory: null,
  learningSession: null,
  activity: null,
  dailyPractice: null,
  activeScreen: "home",
  lastScreen: "home",
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
  screens: Array.from(document.querySelectorAll(".screen")),
  tabButtons: Array.from(document.querySelectorAll(".tab-button")),
  weaknessList: document.getElementById("weaknessList"),
  rosettaList: document.getElementById("rosettaList"),
  forecastList: document.getElementById("forecastList"),
  dailyPracticeButton: document.getElementById("dailyPracticeButton"),
  activityChart: document.getElementById("activityChart"),
  streakValue: document.getElementById("streakValue"),
  streakCard: document.getElementById("streakCard"),
  levelValue: document.getElementById("levelValue"),
  xpValue: document.getElementById("xpValue"),
  dailyProgressFill: document.getElementById("dailyProgressFill"),
  dailyProgressText: document.getElementById("dailyProgressText"),
  dailyTitle: document.getElementById("dailyTitle"),
  dailySubtitle: document.getElementById("dailySubtitle"),
  rosettaHomePercent: document.getElementById("rosettaHomePercent"),
  rosettaHomeFill: document.getElementById("rosettaHomeFill"),
  rosettaHomeButton: document.getElementById("rosettaHomeButton"),
  resetActivityButton: document.getElementById("resetActivityButton"),
  exitQuizButton: document.getElementById("exitQuizButton"),
  exitModal: document.getElementById("exitModal"),
  exitConfirmButton: document.getElementById("exitConfirmButton"),
  exitCancelButton: document.getElementById("exitCancelButton"),
  quizTitle: document.getElementById("quizTitle"),
  summaryScreen: document.getElementById("summaryScreen"),
  summaryScore: document.getElementById("summaryScore"),
  summaryMessage: document.getElementById("summaryMessage"),
  summaryRetryButton: document.getElementById("summaryRetryButton"),
  summaryExitButton: document.getElementById("summaryExitButton"),
};

const STORAGE_KEYS = {
  progress: "solffeggioTestProgress",
  settings: "solffeggioTestSettings",
  activity: "solffeggioActivity",
  dailyPractice: "solffeggioDailyPractice",
};

const DEFAULT_TEST_TRACKS = ["note-treble"];

const FEEDBACK_TIMING = {
  lane: 650,
  notation: 550,
  nextQuestion: 950,
};

const RETRY_SETTINGS = {
  minGap: 2,
  maxGap: 5,
  maxScheduledPerQuestion: 2,
  dueChance: 0.3,
};

const LEARNING_SETTINGS = {
  masteryThreshold: 3,
  newPerSession: 2,
  unlockCount: 5,
};

const XP_SETTINGS = {
  perCorrect: 10,
  perfectBonus: 50,
  streakBonus: 20,
  streakBonusMin: 3,
};

const LEVELS = [
  { level: 1, title: "Pocetnik", xp: 0 },
  { level: 2, title: "Ucenik", xp: 200 },
  { level: 3, title: "Glazbenik", xp: 500 },
  { level: 4, title: "Virtuoz", xp: 900 },
  { level: 5, title: "Maestro", xp: 1400 },
];

const SRS_SETTINGS = {
  intervalsDays: [1, 3, 7, 14, 30],
  dailyDueShare: 0.6,
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

function normalizeProgress(progress) {
  const normalized = progress && typeof progress === "object" ? progress : {};
  if (!normalized.tests || typeof normalized.tests !== "object") normalized.tests = {};
  if (!normalized.learnedTracks || typeof normalized.learnedTracks !== "object") {
    normalized.learnedTracks = {};
  }
  if (!normalized.concepts || typeof normalized.concepts !== "object") {
    normalized.concepts = {};
  }
  if (!normalized.srs || typeof normalized.srs !== "object") {
    normalized.srs = {};
  }
  if (!normalized.profile || typeof normalized.profile !== "object") {
    normalized.profile = { xp: 0, level: 1, badges: {}, lastStreakBonusDate: null };
  } else {
    if (typeof normalized.profile.xp !== "number") normalized.profile.xp = 0;
    if (typeof normalized.profile.level !== "number") normalized.profile.level = 1;
    if (!normalized.profile.badges || typeof normalized.profile.badges !== "object") {
      normalized.profile.badges = {};
    }
    if (typeof normalized.profile.lastStreakBonusDate !== "string") {
      normalized.profile.lastStreakBonusDate = null;
    }
  }
  return normalized;
}

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.progress);
    if (!raw) return normalizeProgress(null);
    const parsed = JSON.parse(raw);
    return normalizeProgress(parsed);
  } catch {
    return normalizeProgress(null);
  }
}

function saveProgress() {
  if (!state.progress) return;
  localStorage.setItem(STORAGE_KEYS.progress, JSON.stringify(state.progress));
}

function getProfile() {
  if (!state.progress) return null;
  if (!state.progress.profile || typeof state.progress.profile !== "object") {
    state.progress.profile = { xp: 0, level: 1, badges: {}, lastStreakBonusDate: null };
  }
  return state.progress.profile;
}

function getLevelInfo(xp) {
  const safeXp = Math.max(0, Math.floor(xp || 0));
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (safeXp >= level.xp) current = level;
  }
  const next = LEVELS.find((level) => level.xp > current.xp) || null;
  return {
    level: current.level,
    title: current.title,
    currentXp: safeXp,
    nextXp: next ? next.xp : null,
  };
}

function awardXp(amount) {
  if (!state.progress || !amount || amount <= 0) return;
  const profile = getProfile();
  if (!profile) return;
  profile.xp = Math.max(0, Math.floor(profile.xp + amount));
  const info = getLevelInfo(profile.xp);
  profile.level = info.level;
  saveProgress();
  renderHomeStats();
}

function grantStreakBonus() {
  const profile = getProfile();
  if (!profile) return;
  const streak = getStreakCount();
  if (streak < XP_SETTINGS.streakBonusMin) return;
  const todayKey = getTodayKey();
  if (profile.lastStreakBonusDate === todayKey) return;
  profile.lastStreakBonusDate = todayKey;
  awardXp(XP_SETTINGS.streakBonus);
}

function getSrsStore(trackId, skill) {
  if (!state.progress) return null;
  if (!state.progress.srs || typeof state.progress.srs !== "object") {
    state.progress.srs = {};
  }
  if (!state.progress.srs[trackId]) state.progress.srs[trackId] = {};
  if (!state.progress.srs[trackId][skill]) state.progress.srs[trackId][skill] = {};
  return state.progress.srs[trackId][skill];
}

function getSrsEntry(trackId, skill, conceptId) {
  const store = getSrsStore(trackId, skill);
  if (!store) return null;
  if (!store[conceptId]) {
    store[conceptId] = { stage: 0, nextReviewAt: null, lastReviewAt: null };
  }
  return store[conceptId];
}

function getSrsSkillForQuestion(question) {
  if (!question) return "general";
  if (question.topic === "note") {
    return question.mode === "ROSETTA" ? "write" : "read";
  }
  return "general";
}

function recordSrsResult(trackId, skill, conceptId, correct) {
  if (!trackId || !conceptId) return;
  const entry = getSrsEntry(trackId, skill, conceptId);
  if (!entry) return;
  const todayKey = getTodayKey();
  const stage = Number.isFinite(entry.stage) ? entry.stage : 0;
  const interval = SRS_SETTINGS.intervalsDays[Math.max(0, Math.min(stage, SRS_SETTINGS.intervalsDays.length - 1))];
  entry.lastReviewAt = todayKey;
  entry.nextReviewAt = addDaysToKey(todayKey, interval);
  entry.stage = correct ? Math.min(stage + 1, SRS_SETTINGS.intervalsDays.length - 1) : 0;
  saveProgress();
}

function isSrsDue(entry, todayKey) {
  if (!entry || !entry.nextReviewAt) return false;
  return entry.nextReviewAt <= todayKey;
}

function getDueSrsEntries(trackId, skill) {
  const store = getSrsStore(trackId, skill);
  if (!store) return [];
  const todayKey = getTodayKey();
  return Object.entries(store)
    .filter(([, entry]) => isSrsDue(entry, todayKey))
    .map(([conceptId, entry]) => ({ conceptId, entry }));
}

function getSrsSummary(trackId) {
  if (!state.progress || !state.progress.srs || !state.progress.srs[trackId]) return null;
  const todayKey = getTodayKey();
  let total = 0;
  let due = 0;
  Object.values(state.progress.srs[trackId]).forEach((skillStore) => {
    Object.values(skillStore).forEach((entry) => {
      if (!entry || !entry.nextReviewAt) return;
      total += 1;
      if (entry.nextReviewAt <= todayKey) due += 1;
    });
  });
  if (!total) return null;
  const freshness = Math.max(0, Math.round(((total - due) / total) * 100));
  return { total, due, freshness };
}

function getSrsContext(question) {
  if (!question) return null;
  const skill = getSrsSkillForQuestion(question);
  if (question.conceptId && question.categoryId) {
    return { trackId: question.categoryId, conceptId: question.conceptId, skill };
  }
  const test = getTestById(state.currentTestId);
  if (!test) return null;
  return { trackId: test.track, conceptId: test.id, skill };
}

function loadActivity() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.activity);
    if (!raw) return { days: {} };
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : { days: {} };
  } catch {
    return { days: {} };
  }
}

function saveActivity() {
  if (!state.activity) return;
  localStorage.setItem(STORAGE_KEYS.activity, JSON.stringify(state.activity));
}

function loadDailyPractice() {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.dailyPractice);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    if (typeof parsed.dateKey !== "string") return null;
    if (!Array.isArray(parsed.queue)) return null;
    return { ...parsed, active: false };
  } catch {
    return null;
  }
}

function saveDailyPractice() {
  if (!state.dailyPractice) return;
  const payload = { ...state.dailyPractice, active: false };
  localStorage.setItem(STORAGE_KEYS.dailyPractice, JSON.stringify(payload));
}

async function loadCurriculum() {
  try {
    const response = await fetch("curriculum.json", { cache: "no-store" });
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || typeof data !== "object") return null;
    return data;
  } catch {
    return null;
  }
}

function getCurriculumCategory(trackId) {
  if (!state.curriculum || !state.curriculum.categories) return null;
  return state.curriculum.categories[trackId] || null;
}

 

function resetActivity() {
  state.activity = { days: {} };
  localStorage.removeItem(STORAGE_KEYS.activity);
  renderDashboards();
}

function getTodayKey() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function addDaysToKey(dateKey, days) {
  const parts = String(dateKey || "").split("-");
  if (parts.length !== 3) return getTodayKey();
  const [year, month, day] = parts.map((value) => Number(value));
  if ([year, month, day].some((value) => Number.isNaN(value))) return getTodayKey();
  const date = new Date(year, month - 1, day);
  date.setDate(date.getDate() + Number(days || 0));
  const outYear = date.getFullYear();
  const outMonth = String(date.getMonth() + 1).padStart(2, "0");
  const outDay = String(date.getDate()).padStart(2, "0");
  return `${outYear}-${outMonth}-${outDay}`;
}

function getDayRecord(dateKey) {
  if (!state.activity.days[dateKey]) {
    state.activity.days[dateKey] = {
      quiz: { answered: 0, correct: 0 },
      rosetta: { answered: 0, correct: 0 },
    };
  }
  return state.activity.days[dateKey];
}

function recordActivity(correct) {
  if (!state.activity) return;
  const dateKey = getTodayKey();
  const modeKey = state.mode === "rosettaStone" ? "rosetta" : "quiz";
  const day = getDayRecord(dateKey);
  day[modeKey].answered += 1;
  if (correct) day[modeKey].correct += 1;
  saveActivity();
  renderActivityChart();
  renderHomeStats();
}

function getAnsweredForDay(dateKey) {
  const day = state.activity.days[dateKey];
  if (!day) return 0;
  return day.quiz.answered + day.rosetta.answered;
}

function getStreakCount() {
  let streak = 0;
  const today = new Date();
  while (true) {
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    const key = `${year}-${month}-${day}`;
    if (getAnsweredForDay(key) > 0) {
      streak += 1;
    } else {
      break;
    }
    today.setDate(today.getDate() - 1);
  }
  return streak;
}

function getDueSrsTestItems() {
  if (!state.progress || !state.progress.srs) return [];
  const todayKey = getTodayKey();
  const items = [];
  Object.entries(state.progress.srs).forEach(([trackId, trackStore]) => {
    Object.entries(trackStore || {}).forEach(([skill, skillStore]) => {
      if (skill === "write") return;
      Object.entries(skillStore || {}).forEach(([conceptId, entry]) => {
        if (!entry || !entry.nextReviewAt) return;
        if (entry.nextReviewAt > todayKey) return;
        const test = getTestById(conceptId);
        if (!test) return;
        items.push({ trackId, skill, conceptId, dueAt: entry.nextReviewAt });
      });
    });
  });
  items.sort((a, b) => a.dueAt.localeCompare(b.dueAt));
  return items;
}

function buildSrsQuestionItem(item) {
  const test = getTestById(item.conceptId);
  if (!test) return null;
  const mode = item.skill === "write" ? "rosettaStone" : "quiz";
  const question = generateQuestionForTest(test, mode);
  question.conceptId = item.conceptId;
  question.categoryId = test.track;
  return { testId: test.id, question };
}

function buildDailyPracticeQueue(targetCount) {
  const queue = [];
  const used = new Set();
  const dueItems = getDueSrsTestItems();
  const dueLimit = Math.round(targetCount * SRS_SETTINGS.dailyDueShare);
  dueItems.slice(0, dueLimit).forEach((item) => {
    const built = buildSrsQuestionItem(item);
    if (!built) return;
    queue.push(built);
    used.add(built.testId);
  });

  const scored = TESTS.map((test) => {
    const progress = getTestProgress(test.id);
    const errors = Math.max(0, TEST_QUESTION_COUNT - progress.best);
    const dueBoost = progress.attempts === 0 ? 3 : progress.best < 6 ? 2 : 0;
    return {
      test,
      weight: Math.max(1, errors + dueBoost),
    };
  });
  const totalWeight = scored.reduce((sum, item) => sum + item.weight, 0);
  while (queue.length < targetCount) {
    let roll = Math.random() * totalWeight;
    let chosen = scored[0].test;
    for (const item of scored) {
      roll -= item.weight;
      if (roll <= 0) {
        chosen = item.test;
        break;
      }
    }
    if (used.has(chosen.id)) continue;
    const question = generateQuestionForTest(chosen, "quiz");
    queue.push({ testId: chosen.id, question });
    used.add(chosen.id);
  }
  return queue;
}

function selectDailyPracticePlan() {
  const todayKey = getTodayKey();
  if (state.dailyPractice && state.dailyPractice.dateKey === todayKey) {
    return state.dailyPractice;
  }
  const target = TEST_QUESTION_COUNT;
  const queue = buildDailyPracticeQueue(target);
  const fallbackId = queue.length ? queue[0].testId : getDefaultTestId();
  state.dailyPractice = {
    dateKey: todayKey,
    testId: fallbackId,
    target,
    queue,
    active: false,
  };
  saveDailyPractice();
  return state.dailyPractice;
}
function getTestProgress(testId) {
  if (!state.progress.tests[testId]) {
    state.progress.tests[testId] = { best: 0, attempts: 0 };
  }
  return state.progress.tests[testId];
}

function getCategoryTests(track) {
  return TESTS.filter((test) => test.track === track);
}

const SOLFEGE_LETTERS = ["C", "D", "E", "F", "G", "A", "H"];

function parseSolfegeNoteId(noteId) {
  const raw = String(noteId || "").trim().toUpperCase();
  const match = raw.match(/^([A-H])(\d+)?$/);
  if (!match) return null;
  let letter = match[1];
  if (letter === "B") letter = "H";
  const octave = match[2] ? Number(match[2]) : 0;
  if (Number.isNaN(octave)) return null;
  return { letter, octave };
}

function formatSolfegeNoteId(note) {
  return `${note.letter}${note.octave}`;
}

function shiftSolfegeNote(note, steps) {
  let index = SOLFEGE_LETTERS.indexOf(note.letter);
  let octave = note.octave;
  if (index < 0) return note;
  let remaining = steps;
  while (remaining !== 0) {
    if (remaining > 0) {
      if (index === SOLFEGE_LETTERS.length - 1) {
        index = 0;
        octave += 1;
      } else {
        index += 1;
      }
      remaining -= 1;
    } else {
      if (index === 0) {
        index = SOLFEGE_LETTERS.length - 1;
        octave -= 1;
      } else {
        index -= 1;
      }
      remaining += 1;
    }
  }
  return { letter: SOLFEGE_LETTERS[index], octave };
}

function solfegeNoteToKey(noteId, clef) {
  const parsed = parseSolfegeNoteId(noteId);
  if (!parsed) return null;
  const noteLetter = parsed.letter === "H" ? "B" : parsed.letter;
  const baseOctave = clef === "bass" ? 1 : 3;
  const keyOctave = parsed.octave + baseOctave;
  return `${noteLetter.toLowerCase()}/${keyOctave}`;
}

function solfegeNoteToMidi(noteId, clef) {
  const key = solfegeNoteToKey(noteId, clef);
  return key ? noteKeyToMidi(key) : null;
}

function buildAscendingSolfegeSequence(lowId, highId, clef) {
  const low = parseSolfegeNoteId(lowId);
  const high = parseSolfegeNoteId(highId);
  if (!low || !high) return [];
  const lowMidi = solfegeNoteToMidi(lowId, clef);
  const highMidi = solfegeNoteToMidi(highId, clef);
  if (lowMidi === null || highMidi === null) return [];
  const start = lowMidi <= highMidi ? low : high;
  const end = lowMidi <= highMidi ? high : low;
  const sequence = [];
  let current = { ...start };
  let guard = 0;
  while (guard < 200) {
    sequence.push(formatSolfegeNoteId(current));
    if (current.letter === end.letter && current.octave === end.octave) break;
    current = shiftSolfegeNote(current, 1);
    guard += 1;
  }
  return sequence;
}

function buildSpiralSequence(generator) {
  if (!generator) return [];
  const clef = generator.clef || "treble";
  const anchor = parseSolfegeNoteId(generator.anchor);
  const bounds = generator.bounds || {};
  if (!anchor || !bounds.lowest || !bounds.highest) return [];
  const lowMidi = solfegeNoteToMidi(bounds.lowest, clef);
  const highMidi = solfegeNoteToMidi(bounds.highest, clef);
  if (lowMidi === null || highMidi === null) return [];
  const minMidi = Math.min(lowMidi, highMidi);
  const maxMidi = Math.max(lowMidi, highMidi);
  const totalNotes = buildAscendingSolfegeSequence(bounds.lowest, bounds.highest, clef);
  if (!totalNotes.length) return [];
  const sequence = [];
  const seen = new Set();
  const inBounds = (note) => {
    const midi = solfegeNoteToMidi(formatSolfegeNoteId(note), clef);
    return midi !== null && midi >= minMidi && midi <= maxMidi;
  };
  const addNote = (note) => {
    const id = formatSolfegeNoteId(note);
    if (!seen.has(id) && inBounds(note)) {
      seen.add(id);
      sequence.push(id);
    }
  };
  addNote(anchor);
  const startDown = String(generator.pattern || "").includes("starting_down");
  let step = 1;
  while (sequence.length < totalNotes.length && step < totalNotes.length * 2) {
    const up = shiftSolfegeNote(anchor, step);
    const down = shiftSolfegeNote(anchor, -step);
    const order = startDown ? [down, up] : [up, down];
    order.forEach(addNote);
    step += 1;
  }
  return sequence;
}

function getConceptProgress(trackId, conceptId) {
  if (!state.progress.concepts[trackId]) state.progress.concepts[trackId] = {};
  const category = state.progress.concepts[trackId];
  if (!category[conceptId]) category[conceptId] = { attempts: 0, correct: 0 };
  return category[conceptId];
}

function recordConceptResult(trackId, conceptId, correct) {
  const entry = getConceptProgress(trackId, conceptId);
  entry.attempts += 1;
  if (correct) entry.correct += 1;
  saveProgress();
  updateTrackUnlock(trackId);
}

function getMasteredConceptCount(trackId) {
  const category = state.progress.concepts[trackId] || {};
  return Object.values(category).filter((item) => item.correct >= LEARNING_SETTINGS.masteryThreshold).length;
}

function updateTrackUnlock(track) {
  if (getMasteredConceptCount(track) >= LEARNING_SETTINGS.unlockCount) {
    markTrackLearned(track);
  }
}

function getNextLearningTest(track) {
  const tests = getCategoryTests(track).slice().sort((a, b) => a.order - b.order);
  if (!tests.length) return null;
  const next = tests.find((test) => getTestProgress(test.id).best < UNLOCK_SCORE);
  return next || tests[tests.length - 1];
}

function getCurriculumSequence(category) {
  if (!category || !category.generator) return [];
  const generator = category.generator;
  if (generator.type === "spiral_from_anchor") {
    return buildSpiralSequence(generator);
  }
  if (generator.type === "ordered_list") {
    return Array.isArray(generator.sequence) ? generator.sequence : [];
  }
  if (generator.type === "explicit_qa") {
    return Array.isArray(generator.sequence) ? generator.sequence : [];
  }
  return [];
}

function buildLearningQuestion(category, conceptId, trackId) {
  if (category.generator && category.generator.type === "spiral_from_anchor") {
    const clef = category.generator.clef || "treble";
    const noteKey = solfegeNoteToKey(conceptId, clef);
    const question = generateNoteQuestionForKey({
      noteKey,
      clef,
      keySig: "C",
      mode: "ROSETTA",
    });
    question.conceptId = conceptId;
    question.categoryId = trackId;
    return question;
  }
  const test = getTestById(conceptId);
  if (test) {
    const question = generateQuestionForTest(test, "quiz");
    question.conceptId = conceptId;
    question.categoryId = trackId;
    return question;
  }
  const fallback = getTestById(state.currentTestId) || TESTS[0];
  const question = generateQuestionForTest(fallback, "quiz");
  question.conceptId = conceptId;
  question.categoryId = trackId;
  return question;
}

function buildLearningQueue(trackId, count) {
  const category = getCurriculumCategory(trackId);
  if (!category) return null;
  const sequence = getCurriculumSequence(category);
  if (!sequence.length) return null;

  const inProgress = [];
  const mastered = [];
  const newConcepts = [];
  sequence.forEach((conceptId) => {
    const progress = getConceptProgress(trackId, conceptId);
    if (progress.attempts === 0) {
      newConcepts.push(conceptId);
    } else if (progress.correct >= LEARNING_SETTINGS.masteryThreshold) {
      mastered.push(conceptId);
    } else {
      inProgress.push(conceptId);
    }
  });

  const srsSkill = category.generator && category.generator.type === "spiral_from_anchor" ? "write" : "general";
  const dueConcepts = getDueSrsEntries(trackId, srsSkill)
    .map((item) => item.conceptId)
    .filter((conceptId) => sequence.includes(conceptId));

  const queue = [];
  const seen = new Set();
  const addConcept = (conceptId) => {
    if (!conceptId || seen.has(conceptId)) return;
    seen.add(conceptId);
    queue.push(conceptId);
  };
  dueConcepts.forEach(addConcept);
  inProgress.forEach(addConcept);
  newConcepts.slice(0, LEARNING_SETTINGS.newPerSession).forEach(addConcept);

  const reviewPool = mastered.length ? mastered : inProgress;
  let cursor = 0;
  while (queue.length < count) {
    if (!reviewPool.length) break;
    addConcept(reviewPool[cursor % reviewPool.length]);
    cursor += 1;
  }
  if (!queue.length) addConcept(sequence[0]);

  const questions = queue.map((conceptId) => buildLearningQuestion(category, conceptId, trackId));
  return { trackId, questions };
}

function markTrackLearned(track) {
  if (!state.progress.learnedTracks) state.progress.learnedTracks = {};
  state.progress.learnedTracks[track] = true;
  saveProgress();
}

function isTrackLearned(track) {
  if (DEFAULT_TEST_TRACKS.includes(track)) return true;
  if (state.progress.learnedTracks && state.progress.learnedTracks[track]) return true;
  return getMasteredConceptCount(track) >= LEARNING_SETTINGS.unlockCount;
}

function getCategoryProgress(track) {
  const tests = getCategoryTests(track);
  const total = tests.length * TEST_QUESTION_COUNT;
  const bestSum = tests.reduce((sum, test) => sum + getTestProgress(test.id).best, 0);
  const percent = total ? Math.round((bestSum / total) * 100) : 0;
  return { percent, bestSum, total };
}

function getOverallProgress(filterFn = null) {
  const tests = filterFn ? TESTS.filter(filterFn) : TESTS;
  const total = tests.length * TEST_QUESTION_COUNT;
  const bestSum = tests.reduce((sum, test) => sum + getTestProgress(test.id).best, 0);
  const percent = total ? Math.round((bestSum / total) * 100) : 0;
  return { percent, bestSum, total };
}

function getCategoryWeaknessStats(track) {
  const tests = getCategoryTests(track);
  return tests.reduce(
    (acc, test) => {
      const progress = getTestProgress(test.id);
      if (progress.attempts > 0) {
        acc.total += TEST_QUESTION_COUNT;
        acc.errors += Math.max(0, TEST_QUESTION_COUNT - progress.best);
      }
      return acc;
    },
    { errors: 0, total: 0 }
  );
}

function getRosettaStats(track) {
  const tests = getCategoryTests(track);
  const total = Math.max(20, tests.length * TEST_QUESTION_COUNT);
  const { percent } = getCategoryProgress(track);
  const learned = Math.round((total * percent) / 100);
  const remaining = Math.max(0, total - learned);
  const learning = Math.round(remaining * 0.35);
  const seen = Math.round(remaining * 0.25);
  const unknown = Math.max(0, remaining - learning - seen);
  const due = Math.round(learned * 0.2);
  return {
    total,
    learned,
    unknown,
    seen,
    learning,
    due,
    percent,
  };
}

function renderWeaknessList() {
  if (!ui.weaknessList) return;
  ui.weaknessList.innerHTML = "";
  const categories = TEST_CATEGORIES.map((category) => {
    const stats = getCategoryWeaknessStats(category.id);
    const percent = stats.total ? Math.round((stats.errors / stats.total) * 100) : 0;
    return { ...category, ...stats, percent };
  });
  categories.sort((a, b) => b.percent - a.percent || b.errors - a.errors);
  const worst = categories.filter((item) => item.errors > 0).slice(0, 2);
  if (!worst.length) {
    const empty = document.createElement("div");
    empty.className = "item-sub";
    empty.textContent = "Nema slabosti za prikaz.";
    ui.weaknessList.appendChild(empty);
    return;
  }
  worst.forEach((item) => {
    const row = document.createElement("div");
    row.className = "list-item weakness-item";
    row.setAttribute("role", "button");
    row.setAttribute("tabindex", "0");
    row.dataset.track = item.id;
    row.innerHTML = `
      <div class="item-stack">
        <div class="item-title">${item.label}</div>
        <div class="item-sub">${item.errors}/${item.total} gresaka</div>
        <div class="mini-progress">
          <div class="progress-fill" style="width: ${item.percent}%"></div>
        </div>
      </div>
      <button class="pill" type="button" data-track="${item.id}">Vjezba</button>
    `;
    const openCategory = () => {
      openCategoryFlow(item.id, false);
    };
    row.addEventListener("click", openCategory);
    row.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCategory();
      }
    });
    const button = row.querySelector("button");
    if (button) {
      button.addEventListener("click", (event) => {
        event.stopPropagation();
        openCategory();
      });
    }
    ui.weaknessList.appendChild(row);
  });
}

function renderRosettaList() {
  if (!ui.rosettaList) return;
  ui.rosettaList.innerHTML = "";
  TEST_CATEGORIES.forEach((category) => {
    const stats = getRosettaStats(category.id);
    const card = document.createElement("div");
    card.className = "rosetta-card";
    const isStarted = stats.learned > 0 || stats.percent >= 5;
    const lessons = getCategoryTests(category.id).length;
    card.innerHTML = `
      <div class="item-title">${category.label}</div>
      <div class="item-sub">${lessons} lekcija • Pocni od osnovnog</div>
      <div class="progress-track">
        <div class="progress-fill" style="width: ${stats.percent}%"></div>
      </div>
      <div class="rosetta-footer">
        <button class="ghost-button${isStarted ? " started" : ""}" type="button" data-track="${
          category.id
        }">${
          isStarted ? "Nastavi" : "Kreni"
        }</button>
      </div>
    `;
    const button = card.querySelector("button");
    if (button) {
      button.addEventListener("click", () => {
        openLearningTrack(category.id);
      });
    }
    ui.rosettaList.appendChild(card);
  });
}

function renderForecastList() {
  if (!ui.forecastList) return;
  ui.forecastList.innerHTML = "";
  const items = TEST_CATEGORIES.map((category) => {
    const stats = getRosettaStats(category.id);
    return {
      label: category.label,
      count: stats.due,
    };
  })
    .filter((item) => item.count > 0)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  if (!items.length) {
    const empty = document.createElement("div");
    empty.className = "item-sub";
    empty.textContent = "Sve kategorije su stabilne.";
    ui.forecastList.appendChild(empty);
    return;
  }

  items.forEach((item) => {
    const row = document.createElement("div");
    row.className = "forecast-item";
    row.innerHTML = `
      <div class="item-title">${item.label}</div>
      <div class="forecast-count">${item.count} pojmova</div>
    `;
    ui.forecastList.appendChild(row);
  });
}

function renderActivityChart() {
  if (!ui.activityChart || !state.activity) return;
  ui.activityChart.innerHTML = "";
  const dayKeys = [];
  const today = new Date();
  for (let i = 6; i >= 0; i -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    dayKeys.push(`${year}-${month}-${day}`);
  }
  const totals = dayKeys.map((key) => {
    const day = state.activity.days[key];
    if (!day) return 0;
    return day.quiz.answered + day.rosetta.answered;
  });
  const max = Math.max(1, ...totals);
  totals.forEach((count) => {
    const bar = document.createElement("div");
    bar.className = "chart-bar";
    const height = Math.max(12, Math.round((count / max) * 100));
    bar.style.height = `${height}%`;
    ui.activityChart.appendChild(bar);
  });
}

function renderHomeStats() {
  if (!state.activity) return;
  const streak = getStreakCount();
  if (ui.streakValue) {
    ui.streakValue.textContent = `🔥 ${streak} dana`;
  }
  if (ui.streakCard) {
    ui.streakCard.classList.toggle("streak-hot", streak >= 7);
  }
  const profile = getProfile();
  if (profile) {
    const info = getLevelInfo(profile.xp);
    profile.level = info.level;
    if (ui.levelValue) ui.levelValue.textContent = `Razina ${info.level}`;
    if (ui.xpValue) ui.xpValue.textContent = `${info.currentXp} XP`;
  }
  const todayKey = getTodayKey();
  const day = state.activity.days[todayKey] || { quiz: { answered: 0 } };
  const dailyTarget = state.dailyPractice ? state.dailyPractice.target : TEST_QUESTION_COUNT;
  const answered = Math.min(dailyTarget, day.quiz.answered);
  const dailyPercent = dailyTarget ? Math.round((answered / dailyTarget) * 100) : 0;
  if (ui.dailyTitle) ui.dailyTitle.textContent = "Dnevna vjezba";
  if (ui.dailySubtitle) ui.dailySubtitle.textContent = "10 pitanja - ~5 min";
  if (ui.dailyProgressFill) {
    ui.dailyProgressFill.style.width = `${dailyPercent}%`;
  }
  if (ui.dailyProgressText) {
    ui.dailyProgressText.textContent = `${answered}/${dailyTarget} rijeseno`;
  }
  if (ui.dailyPracticeButton) {
    ui.dailyPracticeButton.textContent = "Nastavi vjezbu";
  }
  const rosettaProgress = getOverallProgress((test) => test.topic === "note");
  if (ui.rosettaHomePercent) {
    ui.rosettaHomePercent.textContent = `${rosettaProgress.percent}% svladano`;
  }
  if (ui.rosettaHomeFill) {
    ui.rosettaHomeFill.style.width = `${rosettaProgress.percent}%`;
  }
}

function renderDashboards() {
  renderWeaknessList();
  renderRosettaList();
  renderForecastList();
  renderActivityChart();
  renderHomeStats();
}

function showTestCategories() {
  document.body.classList.add("show-tests");
  if (ui.testPanel) ui.testPanel.classList.remove("hidden");
  state.testCategory = null;
  updateTestListUi();
}

function openCategoryFlow(track, preferRosetta) {
  const tests = getCategoryTests(track);
  if (!tests.length) return;
  const originScreen = state.activeScreen;
  const target = tests[0];
  state.currentTestId = target.id;
  if (preferRosetta && target.topic === "note") {
    switchMode("rosettaStone");
  } else {
    switchMode("quiz");
  }
  setActiveScreenWithHistory("tests", { push: false });
  document.body.classList.remove("show-tests");
  if (ui.testPanel) ui.testPanel.classList.add("hidden");
  if (ui.exitModal) ui.exitModal.classList.add("hidden");
  state.testCategory = track;
  updateTestListUi();
  startTest(target.id, originScreen);
}

function openLearningTrack(track) {
  const category = getCurriculumCategory(track);
  if (category && category.generator) {
    startLearningSession(track);
    return;
  }
  const target = getNextLearningTest(track);
  if (!target) return;
  const originScreen = state.activeScreen;
  switchMode(target.topic === "note" ? "rosettaStone" : "quiz");
  setActiveScreenWithHistory("tests", { push: false });
  document.body.classList.remove("show-tests");
  if (ui.testPanel) ui.testPanel.classList.add("hidden");
  if (ui.exitModal) ui.exitModal.classList.add("hidden");
  state.testCategory = track;
  updateTestListUi();
  startTest(target.id, originScreen);
}

function openDailyPractice() {
  const daily = selectDailyPracticePlan();
  startDailyPracticeSession(daily);
}

function startLearningSession(trackId) {
  const session = buildLearningQueue(trackId, TEST_QUESTION_COUNT);
  if (!session || !session.questions.length) return;
  const originScreen = state.activeScreen || "rosetta";
  state.currentTestId = null;
  state.lastScreen = originScreen;
  state.testIndex = 0;
  state.correctCount = 0;
  state.testActive = true;
  state.inputLocked = false;
  if (state.dailyPractice) state.dailyPractice.active = false;
  state.learningSession = { active: true, trackId, queue: session.questions };
  pushHistoryState(state.lastScreen, "quiz", false);
  document.body.classList.add("in-quiz");
  state.retryQueue = [];
  state.questionSerial = 0;
  state.currentQuestionKey = null;
  state.currentQuestionFromRetry = false;
  state.mode = "rosettaStone";
  setActiveScreenWithHistory("tests", { push: false });
  document.body.classList.remove("show-tests");
  if (ui.testPanel) ui.testPanel.classList.add("hidden");
  if (ui.exitModal) ui.exitModal.classList.add("hidden");
  if (ui.summaryScreen) ui.summaryScreen.classList.add("hidden");
  ui.restart.textContent = "Ponovi vjezbu";
  ui.restart.classList.add("hidden");
  updateModeUi(state.mode);
  updateTestStatus();
  updateTestListUi();
  ui.feedback.textContent = "";
  nextQuestion();
}

 

function showExitModal() {
  if (ui.exitModal) ui.exitModal.classList.remove("hidden");
}

function hideExitModal() {
  if (ui.exitModal) ui.exitModal.classList.add("hidden");
}

function endTestSession(options = {}) {
  const { fromPop = false, targetScreen = null } = options;
  state.testActive = false;
  state.inputLocked = false;
  state.retryQueue = [];
  state.questionSerial = 0;
  state.currentQuestion = null;
  state.currentQuestionKey = null;
  state.currentQuestionFromRetry = false;
  if (state.dailyPractice) state.dailyPractice.active = false;
  if (state.learningSession) state.learningSession.active = false;
  if (state.feedbackTimer) {
    clearTimeout(state.feedbackTimer);
    state.feedbackTimer = null;
  }
  if (state.laneFeedbackTimer) {
    clearTimeout(state.laneFeedbackTimer);
    state.laneFeedbackTimer = null;
  }
  document.body.classList.remove("in-quiz");
  if (ui.summaryScreen) ui.summaryScreen.classList.add("hidden");
  hideExitModal();

  const destination = targetScreen || state.lastScreen || "tests";
  if (!fromPop) {
    pushHistoryState(destination, null, true);
  }
  setActiveScreenWithHistory(destination, { fromPop: true, push: false });
  if (destination === "tests") {
    showTestCategories();
  }
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
    const visibleCategories = TEST_CATEGORIES.filter((category) => isTrackLearned(category.id));
    if (!visibleCategories.length) {
      const empty = document.createElement("div");
      empty.className = "list-hint";
      empty.textContent = "Jos nema kategorija za vjezbanje. Kreni u Ucenje.";
      ui.testList.appendChild(empty);
    } else {
    visibleCategories.forEach((category) => {
      const progress = getCategoryProgress(category.id);
      const freshness = getSrsSummary(category.id);
      const actionLabel = "Vjezba";
      const item = document.createElement("div");
      item.className = "test-category";
      item.innerHTML = `
        <div class="test-category-body">
          <div class="test-category-title">${category.label}</div>
          <div class="test-bar">
            <div class="progress-track small">
              <div class="progress-fill" style="width: ${progress.percent}%"></div>
            </div>
          </div>
          ${freshness ? `<div class="item-sub">Svjezina ${freshness.freshness}%</div>` : ""}
        </div>
        <div class="progress-score">${actionLabel}</div>
      `;
      item.addEventListener("click", () => {
        state.testCategory = category.id;
        updateTestListUi();
      });
      ui.testList.appendChild(item);
    });
    }
    if (visibleCategories.length < TEST_CATEGORIES.length) {
      const hint = document.createElement("div");
      hint.className = "list-hint";
      hint.textContent = 'Nauci vise pojmova u "Ucenje" tabu da otkljucas nove vjezbe.';
      ui.testList.appendChild(hint);
    }
    if (ui.testBack) ui.testBack.classList.add("hidden");
    renderDashboards();
    return;
  }

  const filtered = TESTS.filter((test) => test.track === state.testCategory);
  filtered.forEach((test) => {
    const progress = getTestProgress(test.id);
    const unlocked = isTestUnlocked(test);
    const percent = Math.round((progress.best / TEST_QUESTION_COUNT) * 100);
    const card = document.createElement("div");
    const isActive = test.id === state.currentTestId;
    card.className = `test-card${unlocked ? "" : " locked"}${isActive ? " active" : ""}`;
    card.innerHTML = `
      <div class="progress-meta">
        <div>${test.label}</div>
        <div class="test-bar">
          <div class="progress-track small">
            <div class="progress-fill" style="width: ${percent}%"></div>
          </div>
        </div>
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
  renderDashboards();
}

function getTestById(testId) {
  return TESTS.find((test) => test.id === testId) || null;
}

function getDefaultTestId() {
  const defaultTest = TESTS.find((test) => test.track === "note-treble" && test.order === 1);
  return defaultTest ? defaultTest.id : TESTS[0].id;
}

function getSessionQuestionCount() {
  if (state.dailyPractice && state.dailyPractice.active) {
    return state.dailyPractice.target || TEST_QUESTION_COUNT;
  }
  if (state.learningSession && state.learningSession.active && state.learningSession.queue) {
    return state.learningSession.queue.length || TEST_QUESTION_COUNT;
  }
  return TEST_QUESTION_COUNT;
}

function updateTestStatus() {
  const test = getTestById(state.currentTestId);
  const learningCategory = state.learningSession
    ? TEST_CATEGORIES.find((category) => category.id === state.learningSession.trackId)
    : null;
  const title =
    state.dailyPractice && state.dailyPractice.active
      ? "Dnevna vjezba"
      : state.learningSession && state.learningSession.active && learningCategory
      ? `Ucenje: ${learningCategory.label}`
      : state.testActive && test
      ? `Test: ${test.label}`
      : "";
  if (ui.testStatus) {
    ui.testStatus.textContent = title;
  }
  if (ui.quizTitle) ui.quizTitle.textContent = title;
  if (ui.questionProgress) {
    const totalCount = getSessionQuestionCount();
    const currentIndex = state.testActive
      ? Math.min(state.testIndex + 1, totalCount)
      : Math.min(state.testIndex, totalCount);
    ui.questionProgress.textContent = `Pitanje ${currentIndex}/${totalCount}`;
  }
  if (ui.scoreProgress) {
    const totalCount = getSessionQuestionCount();
    ui.scoreProgress.textContent = `Tocno ${state.correctCount}/${totalCount}`;
  }
}

function startTest(testId, originScreen = null) {
  const test = getTestById(testId);
  if (!test) return;
  state.currentTestId = testId;
  state.settings.lastTestId = testId;
  saveSettings();
  state.lastScreen = originScreen || state.activeScreen || "tests";
  state.testIndex = 0;
  state.correctCount = 0;
  state.testActive = true;
  state.inputLocked = false;
  if (state.dailyPractice) state.dailyPractice.active = false;
  if (state.learningSession) state.learningSession.active = false;
  pushHistoryState(state.lastScreen, "quiz", false);
  document.body.classList.add("in-quiz");
  state.retryQueue = [];
  state.questionSerial = 0;
  state.currentQuestionKey = null;
  state.currentQuestionFromRetry = false;
  if (ui.summaryScreen) ui.summaryScreen.classList.add("hidden");
  if (!isRosettaAllowed()) {
    state.mode = "quiz";
  }
  document.body.classList.remove("show-tests");
  if (ui.testPanel) ui.testPanel.classList.add("hidden");
  if (ui.exitModal) ui.exitModal.classList.add("hidden");
  ui.restart.textContent = "Ponovi test";
  ui.restart.classList.add("hidden");
  updateModeUi(state.mode);
  updateTestStatus();
  updateTestListUi();
  ui.feedback.textContent = "";
  nextQuestion();
}

function startDailyPracticeSession(plan) {
  if (!plan || !Array.isArray(plan.queue) || plan.queue.length === 0) return;
  state.currentTestId = plan.testId;
  state.lastScreen = state.activeScreen || "home";
  state.testIndex = 0;
  state.correctCount = 0;
  state.testActive = true;
  state.inputLocked = false;
  if (state.learningSession) state.learningSession.active = false;
  pushHistoryState(state.lastScreen, "quiz", false);
  document.body.classList.add("in-quiz");
  state.retryQueue = [];
  state.questionSerial = 0;
  state.currentQuestionKey = null;
  state.currentQuestionFromRetry = false;
  state.dailyPractice = { ...plan, active: true };
  saveDailyPractice();
  state.mode = "quiz";
  setActiveScreenWithHistory("tests", { push: false });
  document.body.classList.remove("show-tests");
  if (ui.testPanel) ui.testPanel.classList.add("hidden");
  if (ui.exitModal) ui.exitModal.classList.add("hidden");
  if (ui.summaryScreen) ui.summaryScreen.classList.add("hidden");
  ui.restart.textContent = "Ponovi vjezbu";
  ui.restart.classList.add("hidden");
  updateModeUi(state.mode);
  updateTestStatus();
  updateTestListUi();
  ui.feedback.textContent = "";
  nextQuestion();
}

function finishTest() {
  state.testActive = false;
  if ((!state.dailyPractice || !state.dailyPractice.active) && (!state.learningSession || !state.learningSession.active)) {
    const progress = getTestProgress(state.currentTestId);
    progress.attempts += 1;
    progress.best = Math.max(progress.best, state.correctCount);
    saveProgress();
  }
  updateTestListUi();
  updateTestStatus();
  const totalCount = getSessionQuestionCount();
  const percent = totalCount ? Math.round((state.correctCount / totalCount) * 100) : 0;
  if (percent === 100) {
    awardXp(XP_SETTINGS.perfectBonus);
  }
  grantStreakBonus();
  const currentTest = getTestById(state.currentTestId);
  if (state.mode === "rosettaStone" && currentTest && percent >= 60) {
    markTrackLearned(currentTest.track);
  }
  if (ui.summaryScore) {
    ui.summaryScore.textContent = `${state.correctCount}/${totalCount}`;
  }
  if (ui.summaryMessage) {
    ui.summaryMessage.textContent =
      percent >= 90 ? "Izvrsno!" : percent >= 70 ? "Dobro!" : percent >= 50 ? "Moze bolje" : "Nastavi vjezbati";
  }
  if (ui.summaryScreen) ui.summaryScreen.classList.remove("hidden");
  ui.restart.classList.add("hidden");
  if (state.dailyPractice) state.dailyPractice.active = false;
  if (state.learningSession) state.learningSession.active = false;
  hideExitModal();
}

function updateModeUi(mode) {
  if (!ui.quizMode || !ui.rosettaMode) return;
  const rosettaAllowed = isRosettaAllowed();
  if (!rosettaAllowed && mode === "rosettaStone") {
    state.mode = "quiz";
    mode = "quiz";
  }
  ui.quizMode.classList.toggle("active", mode === "quiz");
  ui.rosettaMode.classList.toggle("active", mode === "rosettaStone");
  ui.quizMode.setAttribute("aria-selected", String(mode === "quiz"));
  ui.rosettaMode.setAttribute("aria-selected", String(mode === "rosettaStone"));
  ui.rosettaMode.disabled = !rosettaAllowed;
  ui.rosettaMode.setAttribute("aria-disabled", String(!rosettaAllowed));
  if (!rosettaAllowed) ui.rosettaMode.classList.remove("active");
}

function switchMode(mode) {
  if (mode === "rosettaStone" && !isRosettaAllowed()) return;
  state.mode = mode;
  updateModeUi(mode);
  state.inputLocked = false;
  if (state.testActive) {
    renderQuestion(state.currentQuestion);
  }
}

function isRosettaAllowed() {
  if (state.learningSession && state.learningSession.active) return true;
  const test = getTestById(state.currentTestId);
  return test ? test.topic === "note" : false;
}

function setActiveScreen(screenName) {
  state.activeScreen = screenName;
  ui.screens.forEach((screen) => {
    const isActive = screen.dataset.screen === screenName;
    screen.classList.toggle("active", isActive);
  });
  ui.tabButtons.forEach((button) => {
    const isActive = button.dataset.screen === screenName;
    button.classList.toggle("active", isActive);
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
  if (screenName === "tests" && !document.body.classList.contains("in-quiz")) {
    showTestCategories();
  }
  if (screenName === "rosetta") renderRosettaList();
}

function pushHistoryState(screenName, overlay = null, replace = false) {
  if (!window.history || typeof window.history.pushState !== "function") return;
  const stateObj = { screen: screenName, overlay };
  if (replace) {
    window.history.replaceState(stateObj, "");
  } else {
    window.history.pushState(stateObj, "");
  }
}

function setActiveScreenWithHistory(screenName, options = {}) {
  const { fromPop = false, push = true } = options;
  setActiveScreen(screenName);
  if (!fromPop && push) {
    pushHistoryState(screenName, null, false);
  }
}

function initNavigation() {
  if (!ui.tabButtons.length || !ui.screens.length) return;
  ui.tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const target = button.dataset.screen;
      if (target) setActiveScreenWithHistory(target);
    });
  });
}

async function init() {
  state.settings = loadSettings();
  state.progress = loadProgress();
  state.activity = loadActivity();
  state.dailyPractice = loadDailyPractice();
  state.curriculum = await loadCurriculum();
  window.__curriculum = state.curriculum;
  document.body.classList.remove("in-quiz");
  if (ui.summaryScreen) ui.summaryScreen.classList.add("hidden");
  renderDashboards();
  initNavigation();
  if (window.history && typeof window.history.replaceState === "function") {
    if (!window.history.state) {
      window.history.replaceState({ screen: state.activeScreen, overlay: null }, "");
    }
    window.addEventListener("popstate", (event) => {
      const next = event.state;
      if (!next || !next.screen) return;
      if (next.overlay === "quiz" && !document.body.classList.contains("in-quiz")) {
        pushHistoryState(next.screen, null, true);
      }
      if (document.body.classList.contains("in-quiz")) {
        endTestSession({ fromPop: true, targetScreen: next.screen });
        return;
      }
      setActiveScreenWithHistory(next.screen, { fromPop: true, push: false });
    });
  }
  if (ui.dailyPracticeButton) {
    ui.dailyPracticeButton.addEventListener("click", () => {
      openDailyPractice();
    });
  }
  if (ui.rosettaHomeButton) {
    ui.rosettaHomeButton.addEventListener("click", () => {
      setActiveScreenWithHistory("rosetta");
      document.body.classList.remove("show-tests");
      if (ui.testPanel) ui.testPanel.classList.add("hidden");
    });
  }
  if (ui.resetActivityButton) {
    ui.resetActivityButton.addEventListener("click", () => {
      if (window.confirm("Resetirati aktivnost? Ovo brise graf i streak, ne testove.")) {
        resetActivity();
      }
    });
  }
  if (ui.exitQuizButton) {
    ui.exitQuizButton.addEventListener("click", () => {
      if (!state.testActive) return;
      showExitModal();
    });
  }
  if (ui.exitCancelButton) {
    ui.exitCancelButton.addEventListener("click", () => {
      hideExitModal();
    });
  }
  if (ui.exitConfirmButton) {
    ui.exitConfirmButton.addEventListener("click", () => {
      endTestSession();
    });
  }
  if (ui.summaryRetryButton) {
    ui.summaryRetryButton.addEventListener("click", () => {
      if (state.dailyPractice && state.dailyPractice.dateKey === getTodayKey()) {
        const plan = selectDailyPracticePlan();
        startDailyPracticeSession(plan);
        return;
      }
      if (state.currentTestId) {
        startTest(state.currentTestId);
      }
    });
  }
  if (ui.summaryExitButton) {
    ui.summaryExitButton.addEventListener("click", () => {
      endTestSession();
    });
  }
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
    updateTestStatus();
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

function generateQuestionForTest(test, mode) {
  if (mode === "rosettaStone" && test.topic === "note") {
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

function cloneQuestion(question) {
  if (typeof structuredClone === "function") {
    return structuredClone(question);
  }
  return JSON.parse(JSON.stringify(question));
}

function getQuestionKey(question) {
  const payload = {
    prompt: question.prompt || "",
    type: question.type || "",
    mode: question.mode || "",
    clef: question.clef || "",
    keySig: question.keySig || "",
    notes: question.notes || null,
    accidentals: question.accidentals || null,
    options: question.options || null,
    optionNoteKeys: question.optionNoteKeys || null,
    correctIndex: question.correctIndex,
    explanation: question.explanation || "",
  };
  return JSON.stringify(payload);
}

function clearRetryEntries(questionKey) {
  state.retryQueue = state.retryQueue.filter((entry) => entry.key !== questionKey);
}

function scheduleRetry(questionKey, question, serialIndex) {
  const existingCount = state.retryQueue.filter((entry) => entry.key === questionKey).length;
  if (existingCount >= RETRY_SETTINGS.maxScheduledPerQuestion) return;
  state.retryQueue.push({
    key: questionKey,
    question: cloneQuestion(question),
    dueMin: serialIndex + RETRY_SETTINGS.minGap + 1,
    dueMax: serialIndex + RETRY_SETTINGS.maxGap,
    scheduledAt: serialIndex,
  });
}

function selectRetryQuestion() {
  if (!state.retryQueue.length) return null;
  const currentIndex = state.questionSerial;
  const dueEntries = state.retryQueue.filter((entry) => currentIndex >= entry.dueMin);
  if (!dueEntries.length) return null;

  const overdueEntries = dueEntries.filter((entry) => currentIndex >= entry.dueMax);
  let chosen = null;
  if (overdueEntries.length) {
    overdueEntries.sort((a, b) => a.dueMax - b.dueMax);
    chosen = overdueEntries[0];
  } else if (Math.random() < RETRY_SETTINGS.dueChance) {
    dueEntries.sort((a, b) => a.dueMax - b.dueMax);
    chosen = dueEntries[0];
  }

  if (!chosen) return null;
  const index = state.retryQueue.indexOf(chosen);
  if (index >= 0) state.retryQueue.splice(index, 1);
  return chosen;
}

function getNextQuestion() {
  const retryEntry = selectRetryQuestion();
  if (retryEntry) {
    state.currentQuestionKey = retryEntry.key;
    state.currentQuestionFromRetry = true;
    return retryEntry.question;
  }
  const test = getTestById(state.currentTestId) || TESTS[0];
  const question = generateQuestionForTest(test, state.mode);
  state.currentQuestionKey = getQuestionKey(question);
  state.currentQuestionFromRetry = false;
  return question;
}

function nextQuestion() {
  if (!state.testActive) return;
  const totalCount = getSessionQuestionCount();
  if (state.testIndex >= totalCount) {
    finishTest();
    return;
  }
  state.questionSerial += 1;
  if (state.dailyPractice && state.dailyPractice.active && state.dailyPractice.queue) {
    const item = state.dailyPractice.queue[state.testIndex];
    if (!item) {
      finishTest();
      return;
    }
    state.currentTestId = item.testId;
    state.currentQuestion = item.question;
    state.currentQuestionKey = getQuestionKey(item.question);
    state.currentQuestionFromRetry = false;
  } else if (state.learningSession && state.learningSession.active && state.learningSession.queue) {
    const question = state.learningSession.queue[state.testIndex];
    if (!question) {
      finishTest();
      return;
    }
    state.currentQuestion = question;
    state.currentQuestionKey = getQuestionKey(question);
    state.currentQuestionFromRetry = false;
  } else {
    state.currentQuestion = getNextQuestion();
  }
  renderQuestion(state.currentQuestion);
  updateTestStatus();
}

function renderQuestion(question) {
  ui.prompt.textContent = question.prompt;
  document.body.classList.toggle("mode-rosetta", question.mode === "ROSETTA");
  document.body.classList.toggle("mode-quiz", question.mode === "QUIZ");
  const hideNotation = question.type === "THEORY";
  document.body.classList.toggle("theory-only", hideNotation);
  ui.notationCard.classList.toggle("hidden", hideNotation);
  ui.lanes.forEach((lane, index) => {
    lane.classList.remove("selected", "correct", "wrong");
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
  if (hideNotation) {
    ui.notation.innerHTML = "";
  } else if (question.mode !== "ROSETTA") {
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
  if (question.type === "KEY" || !question.notes || question.notes.length === 0) {
    notes = [];
  } else {
    const { keys, accidentals } = buildKeysWithAccidentals(question);
    const staveNote = new VF.StaveNote({
      clef: question.clef,
      keys,
      duration: "q",
    });
    if (accidentals && accidentals.length) {
      accidentals.forEach((accidental, index) => {
        if (!accidental) return;
        if (typeof staveNote.addAccidental === "function") {
          const acc = buildAccidental(VF, accidental);
          if (acc) staveNote.addAccidental(index, acc);
          return;
        }
        const modifier = buildAccidental(VF, accidental);
        if (modifier) staveNote.addModifier(modifier, index);
      });
    }
    notes = [staveNote];
  }
  notes.forEach((note) => note.setStave(stave));

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

function buildAccidental(VF, accidental) {
  if (VF && typeof VF.Accidental === "function") {
    const acc = new VF.Accidental(accidental);
    if (acc && typeof acc.setNote === "function") return acc;
  }
  if (window.Vex && window.Vex.Flow && typeof window.Vex.Flow.Accidental === "function") {
    const acc = new window.Vex.Flow.Accidental(accidental);
    if (acc && typeof acc.setNote === "function") return acc;
  }
  return null;
}

function buildKeysWithAccidentals(question) {
  const keys = question.notes.map((note) => note.key);
  const accidentals = Array.isArray(question.accidentals) ? [...question.accidentals] : [];
  if (keys.length <= 1) return { keys, accidentals };
  const paired = keys.map((key, index) => ({
    key,
    accidental: accidentals[index] || null,
    midi: noteKeyToMidi(key),
    index,
  }));
  paired.sort((a, b) => {
    if (a.midi === null && b.midi === null) return a.index - b.index;
    if (a.midi === null) return 1;
    if (b.midi === null) return -1;
    return a.midi - b.midi;
  });
  return {
    keys: paired.map((item) => item.key),
    accidentals: paired.map((item) => item.accidental),
  };
}

function handleAnswer(index) {
  if (state.inputLocked || !state.currentQuestion || !state.testActive) return;
  if (index >= state.currentQuestion.options.length) return;
  state.inputLocked = true;
  ui.lanes.forEach((lane) => (lane.disabled = true));
  const correct = index === state.currentQuestion.correctIndex;
  recordActivity(correct);
  if (correct) {
    awardXp(XP_SETTINGS.perCorrect);
  }
  if (
    state.learningSession &&
    state.learningSession.active &&
    state.currentQuestion.conceptId &&
    state.learningSession.trackId
  ) {
    recordConceptResult(state.learningSession.trackId, state.currentQuestion.conceptId, correct);
  }
  const srsContext = getSrsContext(state.currentQuestion);
  if (srsContext) {
    recordSrsResult(srsContext.trackId, srsContext.skill, srsContext.conceptId, correct);
  }
  if (state.currentQuestionKey) {
    if (correct) {
      clearRetryEntries(state.currentQuestionKey);
    } else {
      scheduleRetry(state.currentQuestionKey, state.currentQuestion, state.questionSerial);
    }
  }
  ui.lanes.forEach((lane) => lane.classList.remove("selected", "correct", "wrong"));
  const selectedLane = ui.lanes[index];
  if (selectedLane) {
    selectedLane.classList.add("selected", correct ? "correct" : "wrong");
  }
  if (!correct) {
    const correctLane = ui.lanes[state.currentQuestion.correctIndex];
    if (correctLane) correctLane.classList.add("correct");
  }
  if (state.laneFeedbackTimer) {
    clearTimeout(state.laneFeedbackTimer);
    state.laneFeedbackTimer = null;
  }
  state.laneFeedbackTimer = setTimeout(() => {
    ui.lanes.forEach((lane) => lane.classList.remove("selected", "correct", "wrong"));
    state.laneFeedbackTimer = null;
  }, FEEDBACK_TIMING.lane);
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
  }, FEEDBACK_TIMING.notation);

  if (correct) {
    state.correctCount += 1;
  }

  state.testIndex += 1;
  updateTestStatus();

  setTimeout(() => {
    if (state.testIndex >= getSessionQuestionCount()) {
      finishTest();
    } else {
      nextQuestion();
    }
  }, FEEDBACK_TIMING.nextQuestion);
}

init();
