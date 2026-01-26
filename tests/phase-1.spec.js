const { test, expect } = require("./fixtures");

test.skip("Phase 1 - Pamcenje Slabosti", async ({ page }) => {
  // TODO: implement phase-specific assertions.
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
