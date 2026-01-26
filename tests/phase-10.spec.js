const { test, expect } = require("./fixtures");

test.skip("Phase 10 - Polish i Optimizacija", async ({ page }) => {
  // TODO: implement phase-specific assertions.
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
