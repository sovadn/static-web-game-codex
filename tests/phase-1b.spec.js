const { test, expect } = require("@playwright/test");

test.skip("Phase 1b - Strukturirani Kurikulum", async ({ page }) => {
  // TODO: implement phase-specific assertions.
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
