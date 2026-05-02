const { defineConfig, devices } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './e2e',
  timeout: 30000,
  outputDir: './test-results',
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'on',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'REACT_APP_VOTINGAPP_ENDPOINT=http://localhost:4000 npx react-scripts start',
    port: 3000,
    reuseExistingServer: true,
  },
});
