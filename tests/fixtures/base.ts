import * as database from "../util/db";

import { Page } from "../util/db/types";
import { test as base } from "@playwright/test";

export const TestBase = base.extend<{ db: any; pages: Page[] }>({
  db: async ({}, use) => {
    database.openDb();
    await use(database); // This is not a mistake - the database object is passed to the test
    database.closeDb();
  },
  pages: async ({ db }, use) => {
    const pages = db.getAllPages();
    await use(pages);
  },
});
