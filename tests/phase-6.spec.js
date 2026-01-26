const { test, expect } = require("./fixtures");

test("Phase 6 - Audio Engine", async ({ page }) => {
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

  const audioButton = page.locator("#audioButton");
  await expect(audioButton).toBeVisible();
  await expect(audioButton).toBeEnabled();
});
