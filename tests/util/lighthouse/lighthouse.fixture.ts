import {
  Browser,
  BrowserContext,
  Page,
  test as base,
  chromium,
} from "@playwright/test";

import { getPort } from "get-port-please";
import os from "os";
import path from "path";

export const lighthouseTest = base.extend<
  {},
  { port: number; browser: Browser }
>({
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

export const authedLighthouseTest = base.extend<
  {
    page: Page;
    context: BrowserContext;
  },
  {
    port: number;
  }
>({
  // We need to assign a unique port for each lighthouse test to allow
  // lighthouse tests to run in parallel
  port: [
    async ({}, use) => {
      const port = await getPort();
      await use(port);
    },
    { scope: "worker" },
  ],

  // As lighthouse opens a new page, and as playwright does not by default allow
  // shared contexts, we need to explicitly create a persistent context to
  // allow lighthouse to run behind authenticated routes.
  context: [
    async ({ port }, use) => {
      if (!process.env.BASICAUTHPASS || !process.env.BASICAUTHUSERNAME) {
        throw new Error("Missing basic auth creds.");
      }
      const userDataDir = path.join(os.tmpdir(), "pw", String(Math.random()));

      const context = await chromium.launchPersistentContext(userDataDir, {
        args: [`--remote-debugging-port=${port}`],
        httpCredentials: {
          username: process.env.BASICAUTHUSERNAME,
          password: process.env.BASICAUTHPASS,
        },
      });

      await use(context);
      await context.close();
    },
    { scope: "test" },
  ],

  page: [
    async ({ context }, use) => {
      // Mock any requests on the entire context
      const page = await context.newPage();

      // Setup your auth state by inserting cookies or localStorage values
      await use(page);
    },
    { scope: "test" },
  ],
});
