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

function playNoteSequence(noteKeys, keySig, options = {}) {
  const keys = Array.isArray(noteKeys) ? noteKeys.filter(Boolean) : [];
  if (!keys.length) return;
  const mode = options.mode === "harmonic" ? "harmonic" : "melodic";
  const gapMs = Number.isFinite(options.gapMs) ? options.gapMs : 420;
  if (mode === "harmonic") {
    keys.forEach((key) => playPianoNote(key, keySig));
    return;
  }
  keys.forEach((key, index) => {
    setTimeout(() => playPianoNote(key, keySig), index * gapMs);
  });
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
