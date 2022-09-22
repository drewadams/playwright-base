import { test, expect } from "@playwright/test";
import { existsSync, readFileSync } from "fs";
import { generateSitemap, getSitemap } from "./helpers/sitemapUtils";
import pathStripper from "./helpers/pathStripper";

const sitemapUrl = "<SITEMAP_URL>";
const sitemapPath = pathStripper("<SITEMAP_PATH>");
const previewTheme = "";

test.describe("Visual Comparison", () => {
	if (!existsSync(sitemapPath)) {
		test("Gen sitemap", async () => {
			await generateSitemap(sitemapUrl, sitemapPath);
			test.fail();
		});
	}

	test("Vis Comp", async ({ page }) => {
		const data = JSON.parse(
			readFileSync(sitemapPath, { encoding: "utf-8" })
		).urls;
		for (const url of data) {
			await page.goto(url + previewTheme, { waitUntil: "networkidle" });
			await page.keyboard.press("Escape");
			expect(page).toHaveScreenshot({ maxDiffPixelRatio: 0.2 });
		}
	});
});
