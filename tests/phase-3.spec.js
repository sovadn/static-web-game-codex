const { test, expect } = require("@playwright/test");

test("Phase 3 - Spaced Repetition System", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto("/");

  await page.waitForFunction(() => {
    return typeof recordSrsResult === "function";
  });

  await page.evaluate(() => {
    recordSrsResult("note-treble", "read", "note-treble-small-1", true);
  });

  const entry = await page.evaluate(() => {
    return window.__gameState.progress.srs["note-treble"].read["note-treble-small-1"];
  });

  expect(entry).toBeTruthy();
  expect(entry.nextReviewAt).toBeTruthy();

  const dueCountBefore = await page.evaluate(() => getDueSrsTestItems().length);
  expect(dueCountBefore).toBe(0);

  const dueCountAfter = await page.evaluate(() => {
    const entry =
      window.__gameState.progress.srs["note-treble"].read["note-treble-small-1"];
    entry.nextReviewAt = getTodayKey();
    return getDueSrsTestItems().length;
  });

  expect(dueCountAfter).toBeGreaterThan(0);
});
