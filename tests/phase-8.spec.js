const { test, expect } = require("./fixtures");

test("Phase 8 - Dvosmjerne Vjestine", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "solffeggioTestProgress",
      JSON.stringify({ profile: { onboardingComplete: true } })
    );
  });
  await page.goto("/");

  await page.locator('.tab-bar [data-screen="tests"]').click();
  await page.locator(".test-category").first().click();
  await page.locator(".test-card button").first().click();

  await page.waitForFunction(() => {
    return Boolean(window.__gameState && window.__gameState.currentQuestion);
  });

  const firstMode = await page.evaluate(() => window.__gameState.currentQuestion.mode);
  expect(firstMode).toBe("QUIZ");

  const correctIndex = await page.evaluate(() => window.__gameState.currentQuestion.correctIndex);
  await page.locator(".lane").nth(correctIndex).click();

  await page.waitForFunction(() => window.__gameState.questionSerial >= 2);

  const secondMode = await page.evaluate(() => window.__gameState.currentQuestion.mode);
  expect(secondMode).toBe("ROSETTA");
});
