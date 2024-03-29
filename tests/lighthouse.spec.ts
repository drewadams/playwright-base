import {
  authedLighthouseTest,
  lighthouseTest,
} from "./util/lighthouse/lighthouse.fixture";

import { defaultConfig } from "./util/lighthouse/configs";
import { playAudit } from "playwright-lighthouse";
import { test } from "@playwright/test";

const lighthouseReportName = `lighthouse-${Date.now()}`;
authedLighthouseTest("Test Lighthouse auth", async ({ page, port }) => {
  test.slow();
  await playAudit({
    url: "https://outdoorlife-preprod.go-vip.net/",
    page,
    port,
    thresholds: defaultConfig,
    reports: {
      formats: {
        html: true,
        json: true,
      },
      name: lighthouseReportName,
      directory: "./reports/lighthouse/testclient",
    },
  });
});

lighthouseTest("Test Lighthouse", async ({ page, port }) => {
  test.slow();
  await playAudit({
    url: "https://outdoorlife.com",
    page,
    port,
    thresholds: defaultConfig,
    reports: {
      formats: {
        html: true,
        json: true,
      },
      name: lighthouseReportName + "-noauth",
      directory: "./reports/lighthouse/testclient",
    },
  });
});
