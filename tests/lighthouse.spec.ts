import type { Browser } from "playwright";
import { TestBase as base } from "./fixtures/base";
import { chromium } from "playwright";
import { defaultConfig } from "./util/lighthouse/configs";
import { getAllPages } from "./util/db";
import { getPort } from "get-port-please";
import { playAudit } from "playwright-lighthouse";

const LHThresholdConfig = defaultConfig;

const lighthouseTest = base.extend<{}, { port: number; browser: Browser }>({
  port: [
    async ({}, use) => {
      const port = await getPort();
      await use(port);
    },
    { scope: "worker" },
  ],
  browser: [
    async ({ port }, use) => {
      const browser = await chromium.launch({
        args: [`--remote-debugging-port=${port}`],
      });
      await use(browser);
    },
    { scope: "worker" },
  ],
});

lighthouseTest.use({ baseURL: "https://loveandcompany.com" });
const pages = getAllPages();
pages.map(async ({ url, title }) => {
  lighthouseTest(`Lighthouse ${title}`, async ({ page, baseURL, port }) => {
    await page.goto(baseURL + url);
    await playAudit({
      url: baseURL + url,
      reports: {
        formats: {
          html: true,
        },
        name: title,
        directory: "./tests/data/reports/lighthouse",
      },
      thresholds: LHThresholdConfig,
      port,
    });
  });
});
