const { test, expect } = require("@playwright/test");

test.skip("Phase 0 - Stabilizacija Temelja", async ({ page }) => {
  // TODO: implement phase-specific assertions.
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
