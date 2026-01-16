const { test, expect } = require("@playwright/test");

test("game loads, renders notation, and progresses through questions", async ({ page }) => {
  await page.goto("/");

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
  for (let i = 0; i < 15; i += 1) {
    promptsSeen.add(await prompt.innerText());
    await laneButtons.nth(Math.floor(Math.random() * 3)).click();
    await page.waitForTimeout(200);
  }

  promptsSeen.add(await prompt.innerText());
  expect(promptsSeen.size).toBeGreaterThanOrEqual(5);

  await expect(laneButtons).toHaveCount(3);
  for (let i = 0; i < 3; i += 1) {
    await expect(laneButtons.nth(i)).toBeEnabled();
  }

  const bossStat = page.locator("#bossStat");
  await expect(bossStat).not.toHaveClass(/hidden/);
  await expect(page.locator("#bossValue")).toBeVisible();
});
