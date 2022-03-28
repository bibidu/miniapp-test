const automator = require("miniprogram-automator");
const { find } = require("../utils/find");

describe("phf", () => {
  let mini;
  let page;

  beforeAll(async () => {
    mini = await automator.launch({
      projectPath: "/Users/bibidu/Desktop/xx/bargain/dist",
      cliPath: "/Applications/wechatwebdevtools.app/Contents/MacOS/cli",
    });
    page = await mini.reLaunch("/pages/index/index");
  }, 30000);

  afterAll(async () => {
    await mini.close();
  });

  it("渲染第一条餐品的spu价格", async () => {
    const targetSelector =
      "rocks-container virtuallist customitem product-item online spu-item-price";

    const priceElement = await find(page, targetSelector);
    const price = await priceElement.text();
    expect(price).toEqual("￥18.82");
  });

  it("点击餐品跳转商详页", async () => {
    const targetSelector =
      "rocks-container virtuallist customitem product-item online spu-item-price";

    const priceElement = await find(page, targetSelector);
    await priceElement.tap();
    await page.waitFor(2000);
    const { path: pathAfterNavigate } = await mini.currentPage();

    expect(pathAfterNavigate).toEqual("packages/bargain/product-detail/index");
  });
});
