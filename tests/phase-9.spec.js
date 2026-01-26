const { test, expect } = require("./fixtures");

test("Phase 9 - Tekstualni Sadrzaj", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.setItem(
      "solffeggioTestProgress",
      JSON.stringify({ profile: { onboardingComplete: true }, learnedTracks: { theory: true } })
    );
  });
  await page.goto("/");

  await page.locator('.tab-bar [data-screen="tests"]').click();
  await page.locator(".test-category", { hasText: "Teorija" }).click();
  await page.locator(".test-card button").first().click();

  await page.waitForFunction(() => {
    return Boolean(window.__gameState && window.__gameState.currentQuestion);
  });

  await expect(page.locator("#notationCard")).toHaveClass(/hidden/);
  await expect(page.locator("#promptText")).toBeVisible();
});
