import type { PlaywrightTestConfig } from "@playwright/test";
import { devices } from "@playwright/test";

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// require('dotenv').config();

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
  testDir: "./tests",
  /* Maximum time one test can run for. */
  timeout: 30 * 1000,
  expect: {
    /**
     * Maximum time expect() should wait for the condition to be met.
     * For example in `await expect(locator).toHaveText();`
     */
    timeout: 20000,
  },
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: "html",
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
    actionTimeout: 0,
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: "https://google.com",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: "Test.spec",
      grep: /test\.spec/,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    {
      name: "Lighthouse",
      grep: /lighthouse/,
      use: {
        ...devices["Desktop Chrome"],
        trace: "off",
      },
      retries: 0,
      timeout: 50000,
      fullyParallel: false,
    },
    {
      name: "Vis-comp iPad",
      grep: /vis-comp/,
      retries: 2,
      use: {
        ...devices["iPad Pro 11"],
      },
      snapshotDir: "./test-data/snapshots/ipad",
    },
    {
      name: "Vis-Comp iPhone",
      grep: /vis-comp/,
      retries: 2,
      use: {
        ...devices["iPhone 13 Pro Max"],
      },
      snapshotDir: "./test-data/snapshots/iphone",
    },
    {
      name: "Vis-Comp Chrome",
      grep: /vis-comp/,
      retries: 2,
      use: {
        ...devices["Desktop Chrome"],
      },
      snapshotDir: "./test-data/snapshots/chrome",
    },
    {
      name: "Vis-Comp Safari",
      grep: /vis-comp/,
      retries: 2,
      use: {
        ...devices["Desktop Safari"],
      },
      snapshotDir: "./test-data/snapshots/safari",
    },
    {
      name: "axe-safari",
      grep: /axe\.spec/,
      retries: 2,
      use: {
        ...devices["Desktop Safari"],
      },
      snapshotDir: "./test-data/snapshots/safari",
    },
    {
      name: "Axe-chrome",
      grep: /axe/,
      retries: 2,
      use: {
        ...devices["Desktop Chrome"],
      },
    },
    // {
    // 	name: "chromium",
    // 	use: {
    // 		...devices["Desktop Chrome"],
    // 	},
    // },

    // {
    // 	name: "firefox",
    // 	use: {
    // 		...devices["Desktop Firefox"],
    // 	},
    // },

    // {
    // 	name: "webkit",
    // 	use: {
    // 		...devices["Desktop Safari"],
    // 	},
    // },

    // /* Test against mobile viewports. */
    // {
    // 	name: "Mobile Chrome",
    // 	use: {
    // 		...devices["Pixel 5"],
    // 	},
    // },
    // {
    // 	name: "Mobile Safari",
    // 	use: {
    // 		...devices["iPhone 12"],
    // 	},
    // },

    /* Test against branded browsers. */
    // {
    // 	name: "Microsoft Edge",
    // 	use: {
    // 		channel: "msedge",
    // 	},
    // },
    // {
    //   name: 'Google Chrome',
    //   use: {
    //     channel: 'chrome',
    //   },
    // },
  ],

  /* Folder for test artifacts such as screenshots, videos, traces, etc. */
  // outputDir: 'test-results/',

  /* Run your local dev server before starting the tests */
  // webServer: {
  //   command: 'npm run start',
  //   port: 3000,
  // },
};

export default config;
