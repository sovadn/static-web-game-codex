const { test, expect } = require("./fixtures");

test("Phase 5 - Onboarding", async ({ page }) => {
  await page.addInitScript(() => {
    localStorage.clear();
  });
  await page.goto("/");

  const onboardingScreen = page.locator('#screen-onboarding');
  await expect(onboardingScreen).toBeVisible();

  await page.click("#onboardingStartLearning");

  const rosettaScreen = page.locator('#screen-rosetta');
  await expect(rosettaScreen).toBeVisible();

  const isOnboardingComplete = await page.evaluate(() => {
    const raw = localStorage.getItem("solffeggioTestProgress");
    if (!raw) return false;
    const parsed = JSON.parse(raw);
    return Boolean(parsed?.profile?.onboardingComplete);
  });

  expect(isOnboardingComplete).toBeTruthy();
});
