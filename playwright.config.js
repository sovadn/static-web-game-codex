const { defineConfig } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  timeout: 30000,
  retries: 0,
  use: {
    baseURL: "http://localhost:4173",
    headless: true,
  },
  webServer: {
    command: "npx http-server -p 4173 .",
    url: "http://localhost:4173",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
