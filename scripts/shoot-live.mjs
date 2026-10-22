import { chromium } from "/Users/zhangyiling/.workbuddy/binaries/node/workspace/node_modules/playwright/index.mjs";

const BASE = "https://mystic-tarot-80048.app.workbuddy.host";
const OUT = "/Users/zhangyiling/WorkBuddy/2026-07-25-16-45-30";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text().slice(0, 100)));
page.on("requestfailed", (r) => errors.push("FAILED " + r.url().slice(-60)));

await page.goto(`${BASE}/?sharecode=BVMBPYMIYA`, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: `${OUT}/live-home.png` });
console.log("title:", await page.title());

// click into three-card spread via UI
const started = await page
  .getByRole("button", { name: /start reading|quick reading/i })
  .first()
  .click({ timeout: 8000 })
  .then(() => true)
  .catch(() => false);
console.log("clicked start:", started);
await page.waitForTimeout(2500);
await page.screenshot({ path: `${OUT}/live-reading.png` });
console.log("url now:", page.url());

const broken = await page.evaluate(() =>
  Array.from(document.querySelectorAll("img"))
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => i.getAttribute("src")?.slice(-40))
);
console.log("broken imgs:", broken.length, broken.slice(0, 3));
console.log("console errors:", errors.length, errors.slice(0, 3));

await browser.close();
