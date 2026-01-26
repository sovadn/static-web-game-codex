const { test, expect } = require("./fixtures");

test("Phase 7 - Teachable Moments", async ({ page }) => {
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

  const correctIndex = await page.evaluate(() => window.__gameState.currentQuestion.correctIndex);
  const wrongIndex = (correctIndex + 1) % 3;

  const promptBefore = await page.locator("#promptText").innerText();
  await page.locator(".lane").nth(wrongIndex).click();

  const explanationModal = page.locator("#explanationModal");
  await expect(explanationModal).toBeVisible();

  await page.waitForTimeout(500);
  const promptAfter = await page.locator("#promptText").innerText();
  expect(promptAfter).toBe(promptBefore);

  await page.click("#explanationContinue");
  await expect(explanationModal).toBeHidden();
});
