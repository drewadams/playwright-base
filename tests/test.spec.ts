import { getAllPages } from "./util/db";
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
