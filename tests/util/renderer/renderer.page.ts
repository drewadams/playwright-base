import type { Browser, Page, TestInfo } from "playwright/test";

/**
 * Used to render screenshots of a page.
 */
export class PageRenderer {
  // Playwright
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async takeRenderScreenshots({
    isMobile,
    testInfo,
    path,
    pageTitle,
  }: ScreenshotOptions) {
    const ssPath =
      path ??
      `./tests/suites/render/render-screenshots/${testInfo.project.name}/${pageTitle}.png`;
    await this.page.keyboard.press("End");
    await this.page.waitForTimeout(1000);
    await this.page.keyboard.press("Home");

    await this.page.screenshot({
      fullPage: true,
      path: ssPath,
    });
    await testInfo.attach("Screenshot", {
      contentType: "image/png",
      path: ssPath,
    });
  }
}

interface ScreenshotOptions {
  isMobile: boolean;
  testInfo: TestInfo;
  path?: string;
  pageTitle: string;
}
