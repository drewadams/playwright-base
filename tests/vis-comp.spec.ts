import { expect, test } from "@playwright/test";

import { config as dotenvConfig } from "dotenv";
import pageData from "./test-data/pageData.json";

dotenvConfig();

const baseUrls = {
  prod: "",
  preprod: "",
  qa: "",
  dev: "",
};

test.use({
  baseURL: baseUrls.qa,
});

pageData.map((page) => {
  test(`${page.title} -  Visual Comparison`, async ({ browser }) => {
    const context = await browser.newContext({
      javaScriptEnabled: false,
      httpCredentials: {
        username: process.env.BASICAUTHUSERNAME!,
        password: process.env.BASICAUTHPASS!,
      },
    });
    const page = await context.newPage();
    await page.goto(page.url + "?mtc_disable");
    await page.keyboard.press("End");
    await page.waitForTimeout(1000);
    await expect(page).toHaveScreenshot({
      fullPage: true,
      maxDiffPixelRatio: 0.2,
    });
  });
});
