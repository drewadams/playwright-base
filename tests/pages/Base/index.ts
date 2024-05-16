import { BrowserContext, Page } from "@playwright/test";

import { test as base } from "@playwright/test";
import { getRandomUser } from "../../util/db";

export class BasePage {
  protected page: Page;
  constructor(page: Page) {
    this.page = page;
  }

  async goto(url: string) {
    return await this.page.goto(url);
  }

  async fullPageScreenshot(path: string) {
    return await this.page.screenshot({ path, fullPage: true });
  }

  async getUser() {
    return await getRandomUser();
  }
}

export const baseTest = base.extend<{ base: BasePage }>({
  base: async ({ page }, use) => {
    const basePage = new BasePage(page);
    await use(basePage);
  },
});

// For use in tests that require basic authentication
export const AuthenticatedBaseTest = baseTest.extend<{
  user: any;
  context: BrowserContext;
  base: BasePage;
}>({
  context: async ({ browser }, use) => {
    const context = await browser.newContext({
      httpCredentials: {
        username: "test",
        password: "test",
      },
    });
    await use(context);
  },

  base: async ({ context }, use) => {
    const page = await context.newPage();
    const basePage = new BasePage(page);
    await use(basePage);
  },

  // Worker scoped -
  // Each worker will get a unique user
  user: [
    async ({ base }, use) => {
      const user = await base.getUser();
      await use(user);
    },
    { scope: "worker" },
  ],
});
