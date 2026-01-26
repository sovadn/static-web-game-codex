const { test, expect } = require("@playwright/test");

test.skip("Phase 2 - Gamifikacija i Motivacija", async ({ page }) => {
  // TODO: implement phase-specific assertions.
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
