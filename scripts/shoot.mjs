import { chromium } from "/Users/zhangyiling/.workbuddy/binaries/node/workspace/node_modules/playwright/index.mjs";

const BASE = "http://127.0.0.1:4173";
const OUT = process.cwd();

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });

async function shot(name) {
  await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: false });
  console.log("shot:", name);
}

await page.goto(BASE, { waitUntil: "networkidle" });
await shot("shot-home");

await page.goto(`${BASE}/reading/celtic-cross`, { waitUntil: "networkidle" });
await page.waitForTimeout(1200);
await shot("shot-backs");

// reveal all
const reveal = page.getByRole("button", { name: /reveal all/i }).first();
if (await reveal.count()) {
  await reveal.click();
  await page.waitForTimeout(2500);
}
await shot("shot-revealed");

// click a card to open meaning popup
const cards = page.locator("button", { hasText: /.*/ });
const firstCard = page.getByRole("button").filter({ hasText: /of|the/i }).first();
try {
  await firstCard.click({ timeout: 3000 });
  await page.waitForTimeout(1200);
  await shot("shot-popup");
} catch (e) {
  console.log("popup click skipped:", e.message.slice(0, 60));
}

const failed = await page.evaluate(() =>
  Array.from(document.querySelectorAll("img"))
    .filter((i) => i.complete && i.naturalWidth === 0)
    .map((i) => i.getAttribute("src"))
    .slice(0, 10)
);
console.log("broken imgs:", failed.length, failed.slice(0, 5));

await browser.close();
