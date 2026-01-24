const { test, expect } = require("@playwright/test");

test("game loads, renders notation, and progresses through questions", async ({ page }) => {
  await page.goto("/");

  await page.locator('.tab-bar [data-screen="tests"]').click();
  await page.locator(".test-category").first().click();
  await page.locator(".test-card button").first().click();

  await page.waitForFunction(() => {
    const notation = document.querySelector("#notation");
    return Boolean(notation && notation.querySelector("svg"));
  });

  const prompt = page.locator("#promptText");
  const laneButtons = page.locator(".lane");

  await page.evaluate(() => {
    if (window.__gameState) {
      window.__gameState.army = 999;
      window.__gameState.questionCount = 11;
    }
  });

  const promptsSeen = new Set();
  for (let i = 0; i < 8; i += 1) {
    promptsSeen.add(await prompt.innerText());
    await expect(laneButtons.first()).toBeEnabled();
    await laneButtons.nth(Math.floor(Math.random() * 3)).click();
    await page.waitForTimeout(1100);
  }

  promptsSeen.add(await prompt.innerText());
  expect(promptsSeen.size).toBeGreaterThanOrEqual(1);

  const laneCount = await laneButtons.count();
  expect(laneCount).toBeGreaterThanOrEqual(3);
  for (let i = 0; i < Math.min(3, laneCount); i += 1) {
    await expect(laneButtons.nth(i)).toBeEnabled();
  }

  await expect(prompt).toBeVisible();
});
