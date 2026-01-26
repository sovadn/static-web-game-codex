const { test, expect } = require("@playwright/test");

test("Phase 1B - Strukturirani Kurikulum", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto("/");

  await page.waitForFunction(() => {
    return Boolean(window.__curriculum && window.__curriculum.categories);
  });
  const debug = await page.evaluate(() => {
    const category = window.__curriculum?.categories?.["note-treble"];
    if (!category) return null;
    const gen = category.generator;
    return {
      anchor: parseSolfegeNoteId(gen.anchor),
      low: parseSolfegeNoteId(gen.bounds.lowest),
      high: parseSolfegeNoteId(gen.bounds.highest),
      lowMidi: solfegeNoteToMidi(gen.bounds.lowest, gen.clef),
      highMidi: solfegeNoteToMidi(gen.bounds.highest, gen.clef),
      sequenceLength: buildSpiralSequence(gen).length,
    };
  });
  expect(debug).not.toBeNull();
  expect(debug.lowMidi).not.toBeNull();
  expect(debug.highMidi).not.toBeNull();
  expect(debug.sequenceLength).toBeGreaterThan(0);

  await page.locator('.tab-bar [data-screen="rosetta"]').click();
  await page.locator(".rosetta-card button").first().click();

  await page.waitForFunction(() => {
    return Boolean(window.__gameState && window.__gameState.currentQuestion);
  });

  const session = await page.evaluate(() => window.__gameState && window.__gameState.learningSession);
  expect(session && session.active).toBeTruthy();
  expect(session.queue.length).toBeGreaterThan(0);

  const conceptId = await page.evaluate(
    () => window.__gameState && window.__gameState.currentQuestion && window.__gameState.currentQuestion.conceptId
  );
  expect(conceptId).toBeTruthy();
});
