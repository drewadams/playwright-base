import { Page } from "playwright/test";

/**
 * BasePage class that all page objects should extend.
 */
export class BasePage {
  page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    await this.page.goto(url);
  }

  async fullPageScreenshot(
    path: string = "tests/data/screenshots/screenshot.png"
  ) {
    await this.page.screenshot({ fullPage: true, path });
  }
}
