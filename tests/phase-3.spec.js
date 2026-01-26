const { test, expect } = require("@playwright/test");

test.skip("Phase 3 - Spaced Repetition System", async ({ page }) => {
  // TODO: implement phase-specific assertions.
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
