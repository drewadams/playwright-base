import { existsSync, rmSync } from "fs";

import AxeBuilder from "@axe-core/playwright";
import { createHtmlReport } from "axe-html-reporter";
import { test } from "@playwright/test";

test("Axe tools run", async ({ page }, testInfo) => {
  try {
    await page.goto("https://google.com");
    const axeResults = await new AxeBuilder({ page }).analyze();
    createHtmlReport({
      // @ts-ignore - axeResults is the way to do this - bug in the types
      results: axeResults,
      options: {
        projectKey: "google",
        outputDir: `./axe-report/${testInfo.project.name}`,
        reportFileName: "report.html",
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      console.log(error);
    }
  }
});

// Axe creates this file, not sure why so I'm getting rid of it.
test.afterAll(async () => {
  if (existsSync("./salt")) {
    rmSync("./salt");
  }
});
