const { test, expect } = require("@playwright/test");

test("Phase 4 - Struktura Kurikuluma", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto("/");

  await page.locator('.tab-bar [data-screen="rosetta"]').click();

  const trebleCard = page.locator(".rosetta-card", {
    has: page.locator('button[data-track="note-treble"]'),
  });
  await expect(trebleCard.locator('button[data-track="note-treble"]')).toBeEnabled();

  const bassCard = page.locator(".rosetta-card", {
    has: page.locator('button[data-track="note-bass"]'),
  });
  await expect(bassCard).toHaveClass(/locked/);
  await expect(bassCard.locator('button[data-track="note-bass"]')).toBeDisabled();
});
