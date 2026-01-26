const { test, expect } = require("./fixtures");

test("Phase 2 - Gamifikacija i Motivacija", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto("/");

  await page.waitForFunction(() => {
    return typeof awardXp === "function";
  });

  const xpBefore = await page.locator("#xpValue").innerText();

  await page.evaluate(() => {
    if (typeof awardXp === "function") {
      awardXp(10);
    }
  });

  await page.waitForFunction(
    (previous) => {
      const el = document.getElementById("xpValue");
      if (!el) return false;
      return el.textContent !== previous;
    },
    xpBefore
  );

  const xpAfter = await page.locator("#xpValue").innerText();
  const beforeValue = Number(xpBefore.replace(/\D/g, ""));
  const afterValue = Number(xpAfter.replace(/\D/g, ""));
  expect(afterValue).toBeGreaterThan(beforeValue);
});
