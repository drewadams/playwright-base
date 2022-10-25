import { chromium } from "playwright";
import type { Browser } from "playwright";
import { playAudit } from "playwright-lighthouse";
import { test as base } from "@playwright/test";
import { getPort } from "get-port-please";
import fs from "fs";
import {
	accessibilityConfig,
	defaultConfig,
} from "./helpers/lighthouse/configs";
import pathStripper from "./helpers/pathStripper";

const path = "./test-data/test-urls.json";
const urls = JSON.parse(fs.readFileSync(path, { encoding: "utf-8" })).urls;

const LHThresholdConfig = defaultConfig;

const lighthouseTest = base.extend<{}, { port: number; browser: Browser }>({
	port: [
		async ({}, use) => {
			// Assign a unique port for each playwright worker to support parallel tests
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

lighthouseTest.describe("Lighthouse", () => {
	for (const url of urls) {
		lighthouseTest(`Lighthouse test for ${url}`, async ({ page, port }) => {
			page.on("dialog", async (dialog) => {
				console.log(`Type: ${dialog.type()}`);
				await dialog.dismiss();
			});
			await page.goto(url, { waitUntil: "load" });
			const title = pathStripper(await page.title());
			console.log(title);
			await playAudit({
				url: url,
				reports: {
					formats: {
						html: true,
					},
					name: `${title}`,
					directory: "./test-data/lighthouse",
				},

				thresholds: LHThresholdConfig,
				port,
			});
		});
	}
});
