import { chromium, devices } from "/Users/zhangyiling/.workbuddy/binaries/node/workspace/node_modules/playwright/index.mjs";

const BASE = "https://tarot-reader-ivory.vercel.app";
const OUT = "/Users/zhangyiling/WorkBuddy/2026-07-25-16-45-30";
const browser = await chromium.launch();

async function check(label, viewportOpts, isMobile) {
  const ctx = await browser.newContext(viewportOpts);
  const page = await ctx.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push("PAGEERR " + e.message.slice(0, 80)));
  page.on("requestfailed", (r) => errors.push("REQFAIL " + r.url().slice(-50)));

  await page.goto(`${BASE}/#/`, { waitUntil: "networkidle", timeout: 45000 });
  await page.waitForTimeout(1200);
  await page.screenshot({ path: `${OUT}/v-${label}-home.png` });

  await page.goto(`${BASE}/#/reading/celtic-cross`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  const reveal = page.getByRole("button", { name: /reveal all/i }).first();
  if (await reveal.count()) await reveal.click().catch(() => {});
  await page.waitForTimeout(2500);

  const res = await page.evaluate(() =>
    Array.from(document.querySelectorAll("img")).map((i) => ({
      src: (i.getAttribute("src") || "").split("/").slice(-3).join("/"),
      ok: i.complete && i.naturalWidth > 0,
    }))
  );
  const cards = res.filter((r) => r.src.includes("tarot/"));
  const broken = cards.filter((c) => !c.ok);
  console.log(
    `[${label}] card imgs=${cards.length} broken=${broken.length} ` +
      `errors=${errors.length} ${errors.slice(0, 2).join(" | ")}`
  );
  if (broken.length) console.log("  broken:", broken.slice(0, 5).map((b) => b.src));
  await page.screenshot({ path: `${OUT}/v-${label}-reading.png` });
  await ctx.close();
  return broken.length + errors.length;
}

const desktopBad = await check(
  "desktop",
  { viewport: { width: 1440, height: 1000 } },
  false
);
const iphone = devices["iPhone 13"];
const mobileBad = await check("mobile", { ...iphone }, true);

console.log("=====");
console.log(desktopBad === 0 && mobileBad === 0 ? "ALL PASS" : "ISSUES FOUND");
await browser.close();
