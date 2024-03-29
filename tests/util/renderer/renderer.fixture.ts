import { BrowserContext, Page, test as base } from "@playwright/test";

import { PageRenderer } from ".";

export const RenderScreenshotGenerator = base.extend<{
  PageRenderer: PageRenderer;
}>({
  context: [
    async ({ browser }, use) => {
      const context = await browser.newContext({
        javaScriptEnabled: false,
      });
      await use(context);
    },
    { scope: "test" },
  ],
  PageRenderer: [
    async ({ page }, use) => {
      const pageRenderer = new PageRenderer(page);
      await use(pageRenderer);
    },
    { scope: "test" },
  ],
});

export const AuthenticatedRenderScreenshotGenerator =
  RenderScreenshotGenerator.extend<{
    context: BrowserContext;
    PageRenderer: PageRenderer;
    page: Page;
  }>({
    context: [
      async ({ browser }, use) => {
        const context = await browser.newContext({
          javaScriptEnabled: false,
          httpCredentials: {
            username: process.env.BASICAUTHUSERNAME!,
            password: process.env.BASICAUTHPASS!,
          },
        });
        await use(context);
      },
      { scope: "test" },
    ],
  });
