const base = require("@playwright/test");

const CONSOLE_IGNORE = [
  /Download the React DevTools/i,
];

function shouldIgnoreConsole(message) {
  return CONSOLE_IGNORE.some((pattern) => pattern.test(message));
}

const test = base.test.extend({});

test.beforeEach(async ({ page }, testInfo) => {
  const consoleMessages = [];
  testInfo._consoleMessages = consoleMessages;

  page.on("pageerror", (error) => {
    if (!error) return;
    consoleMessages.push({ type: "pageerror", text: String(error.message || error) });
  });

  page.on("console", (msg) => {
    const type = msg.type();
    if (type !== "error" && type !== "warning") return;
    const text = msg.text();
    if (shouldIgnoreConsole(text)) return;
    consoleMessages.push({ type, text });
  });
});

test.afterEach(async ({}, testInfo) => {
  const consoleMessages = testInfo._consoleMessages || [];
  if (!consoleMessages.length) return;
  const formatted = consoleMessages.map((msg) => `- [${msg.type}] ${msg.text}`).join("\n");
  throw new Error(`Console issues detected:\n${formatted}`);
});

module.exports = {
  test,
  expect: base.expect,
};
