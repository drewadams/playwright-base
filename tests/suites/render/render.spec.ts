import {
  AuthenticatedRenderScreenshotGenerator,
  RenderScreenshotGenerator,
} from "../../util/renderer";

import pageData from "../../test-data/pageData.json";

pageData.map(({ url, title }) => {
  RenderScreenshotGenerator(
    title,
    async ({ page, PageRenderer, isMobile }, testInfo) => {
      await page.goto(url);
      await PageRenderer.takeRenderScreenshots({
        isMobile,
        testInfo,
        pageTitle: title,
      });
    }
  );
});
