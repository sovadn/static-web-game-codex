const { test, expect } = require("@playwright/test");

test.skip("Phase 8 - Dvosmjerne Vjestine", async ({ page }) => {
  // TODO: implement phase-specific assertions.
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
