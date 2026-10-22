import { chromium } from "/Users/zhangyiling/.workbuddy/binaries/node/workspace/node_modules/playwright/index.mjs";

const BASE = "https://mystic-tarot-80048.app.workbuddy.host";
const OUT = "/Users/zhangyiling/WorkBuddy/2026-07-25-16-45-30";
const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 1100 } });

await page.goto(`${BASE}/?sharecode=BVMBPYMIYA#/reading/celtic-cross`, {
  waitUntil: "networkidle",
  timeout: 45000,
});
await page.waitForTimeout(1500);

let totalChecked = 0;
const allBroken = [];
const seen = new Set();

for (let round = 1; round <= 3; round++) {
  const reveal = page.getByRole("button", { name: /reveal all/i }).first();
  if (await reveal.count()) await reveal.click().catch(() => {});
  await page.waitForTimeout(2500);

  const res = await page.evaluate(() =>
    Array.from(document.querySelectorAll("img")).map((i) => ({
      src: i.getAttribute("src") || "",
      ok: i.complete && i.naturalWidth > 0,
    }))
  );
  const cardImgs = res.filter((r) => r.src.includes("/tarot/"));
  for (const c of cardImgs) {
    seen.add(c.src.split("/").pop());
    if (!c.ok) allBroken.push(c.src.split("/").slice(-3).join("/"));
  }
  totalChecked += cardImgs.length;
  console.log(`round ${round}: card imgs=${cardImgs.length} broken=${cardImgs.filter((c) => !c.ok).length}`);
  await page.screenshot({ path: `${OUT}/verify-round${round}.png` });

  const shuffle = page.getByRole("button", { name: /shuffle|new reading/i }).first();
  if (await shuffle.count()) await shuffle.click().catch(() => {});
  await page.waitForTimeout(1500);
}

console.log("unique card files rendered:", seen.size);
console.log("total img checks:", totalChecked);
console.log("BROKEN:", allBroken.length, allBroken.slice(0, 8));
await browser.close();
