import { chromium, test } from "playwright/test";

for (const width of [320, 375, 768, 1024, 1280, 1920]) {
  test(`reports location overflow at ${width}px`, async () => {
    const browser = await chromium.launch({ channel: "msedge" });
    const page = await browser.newPage({
      viewport: { width, height: 900 },
    });

    await page.goto("http://localhost:3000/location", {
      waitUntil: "networkidle",
    });

    const report = await page.evaluate(() => {
      const viewportWidth = document.documentElement.clientWidth;
      const scrollWidth = document.documentElement.scrollWidth;
      const offenders = [...document.querySelectorAll("*")]
        .map((element) => {
          const rect = element.getBoundingClientRect();

          return {
            element: `${element.tagName.toLowerCase()}.${[...element.classList].join(".")}`,
            left: Math.round(rect.left * 100) / 100,
            right: Math.round(rect.right * 100) / 100,
            width: Math.round(rect.width * 100) / 100,
          };
        })
        .filter(
          ({ left, right }) =>
            left < -0.5 || right > viewportWidth + 0.5,
        )
        .slice(0, 20);

      return { viewportWidth, scrollWidth, offenders };
    });

    console.log(JSON.stringify({ requestedWidth: width, ...report }));
    await browser.close();
  });
}
