import { getAllPages, openDb } from "./util/db";

import { Page } from "./util/db/types";
import { TestBase as test } from "./fixtures/base";

const pages = getAllPages();
pages.map(({ url, title }) => {
  test(`testing pages ${title}`, async ({ pages }) => {
    console.log(url, title);
  });
});
// test.describe("Visual Comparison", async () => {
//   test(`testing pages`, async ({ pages }) => {
//     pages.map(({ url, title }) => {
//       test.step(title, async () => {
//         console.log(url);
//       });
//     });
//   });
// });
