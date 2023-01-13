import { test } from "@playwright/test";
import pathStripper from "./helpers/pathStripper";
/**
 * This is a quick way to generate screenshots of a website for cross-browser manual verification.
 * They could be used for visual comparison as necessary.
 */

const data = []; // Fill with urls of pages to screenshot.

// Tailwind viewports
const viewports = [
	{ width: 1536, height: 1080, size: "xxl" },
	{ width: 1280, height: 1080, size: "xl" },
	{ width: 1024, height: 1080, size: "lg" },
	{ width: 768, height: 1080, size: "md" },
	{ width: 640, height: 1080, size: "sm" },
];

function checkRender() {
	for (const url of data) {
		test(`Check ${url}`, async ({ page }, testInfo) => {
			test.slow();
			if (
				testInfo.project.name === "Screenshots Safari" ||
				testInfo.project.name === "Screenshots Chrome"
			) {
				for (const { width, height, size } of viewports) {
					await page.setViewportSize({
						width: width,
						height: height,
					});
					await page.goto(process.env.URL + url);
					await screenshot(size);
				}
			} else {
				await page.goto(process.env.URL + url);
				await screenshot();
			}

			async function screenshot(viewportSize?: string) {
				await page.keyboard.press("End");
				await page.waitForTimeout(1500);
				await page.keyboard.press("Home");
				const title = pathStripper(await page.title());
				const ssPath = viewportSize
					? `./test-data/render-screenshots/${testInfo.project.name}/${title}-${viewportSize}.png`
					: `./test-data/render-screenshots/${testInfo.project.name}/${title}.png`;

				await page.screenshot({
					fullPage: true,
					path: ssPath,
				});
				await testInfo.attach("Screenshot", {
					contentType: "image/png",
					path: ssPath,
				});
			}
		});
	}
}

test.describe.parallel("Check render", () => {
	checkRender();
});
