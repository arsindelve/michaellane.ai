import { chromium } from 'playwright-core';
import fs from 'node:fs';

const OUT = 'src/assets/shots/rev/';
fs.mkdirSync(OUT, { recursive: true });
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8'));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
for (const job of jobs) {
  const page = await ctx.newPage();
  const url = `https://web.archive.org/web/${job.ts}if_/${job.url}`;
  let ok = false;
  for (let attempt = 0; attempt < 3 && !ok; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 120000 });
      ok = true;
    } catch (e) {
      console.log('load fail', job.name, e.message.split('\n')[0]);
      await sleep(10000);
    }
  }
  if (!ok) { await page.close(); continue; }
  // slow scroll for lazy content
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  for (let y = 0; y < h; y += 400) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await sleep(250);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await sleep(4000);
  // hide cookie / consent / chat overlays
  await page.addStyleTag({ content: `#onetrust-banner-sdk,#onetrust-consent-sdk,.cookie-banner,[id*="cookie" i],[class*="cookie" i],[id*="hubspot-messages" i],#hubspot-messages-iframe-container,[class*="intercom" i],iframe[title*="chat" i]{display:none !important}` }).catch(() => {});
  const text = await page.evaluate(() => document.body.innerText);
  const title = await page.title();
  console.log('==', job.name, 'title:', title, 'len:', text.length);
  if (job.find) {
    const re = new RegExp(job.find, 'i');
    const idx = text.search(re);
    console.log('  find', job.find, idx >= 0 ? 'FOUND: ' + text.slice(Math.max(0, idx - 200), idx + 200).replace(/\s+/g, ' ') : 'NOT FOUND');
    if (idx >= 0) {
      const loc = page.getByText(re).first();
      try {
        await loc.evaluate((el) => el.scrollIntoView({ block: 'center' }));
        if (job.offset) await page.evaluate((o) => window.scrollBy(0, o), job.offset);
      } catch (e) { console.log('  scroll fail', e.message.split('\n')[0]); }
    }
  }
  await sleep(2500);
  await page.screenshot({ path: OUT + job.name + '.png' });
  if (job.full) {
    await page.screenshot({ path: OUT + job.name + '-full.png', fullPage: true });
  }
  if (job.dumpText) fs.writeFileSync(job.dumpText, text);
  await page.close();
  await sleep(3000);
}
await browser.close();
