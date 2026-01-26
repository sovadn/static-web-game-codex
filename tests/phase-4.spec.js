const { test, expect } = require("@playwright/test");

test.skip("Phase 4 - Struktura Kurikuluma", async ({ page }) => {
  // TODO: implement phase-specific assertions.
  await page.goto("/");
  await expect(page.locator("body")).toBeVisible();
});
