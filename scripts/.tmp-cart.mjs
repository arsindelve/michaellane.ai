import { chromium } from 'playwright-core';

const OUT = process.argv[2];
const targets = [
  ['home-2022', '20221102173832', 'https://www.cart.com/'],
  ['home-2023', '20231204224528', 'https://cart.com/'],
  ['fulfillment-2022', '20221003154111', 'https://www.cart.com/solution/fulfillment'],
  ['fulfillment-2023', '20231207072613', 'https://cart.com/solution/fulfillment'],
  ['contract-logistics-2023', '20231204000000', 'https://cart.com/solution/fulfillment-contract-logistics'],
  ['storefront-2022', '20221206021111', 'https://www.cart.com/solution/storefront'],
  ['channels-2022', '20221201000000', 'https://www.cart.com/solution/channels'],
  ['about-2023', '20231204224552', 'https://cart.com/about'],
];
const only = process.argv.slice(3);

const browser = await chromium.launch({ channel: 'chrome' });
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
for (const [name, ts, url] of targets) {
  if (only.length && !only.includes(name)) continue;
  const page = await ctx.newPage();
  const wb = `https://web.archive.org/web/${ts}if_/${url}`;
  try {
    const resp = await page.goto(wb, { waitUntil: 'load', timeout: 120000 });
    console.log(name, resp?.status(), page.url());
    await page.waitForTimeout(3000);
    const h = await page.evaluate(() => document.body.scrollHeight);
    for (let y = 0; y < h; y += 400) {
      await page.evaluate((yy) => window.scrollTo(0, yy), y);
      await page.waitForTimeout(250);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(3000);
    // strip cookie banners / chat widgets
    await page.evaluate(() => {
      const sel = ['#hs-eu-cookie-confirmation', '#onetrust-consent-sdk', '#CybotCookiebotDialog', '.cky-consent-container', '#usercentrics-root', '#hubspot-messages-iframe-container', '#drift-widget-container', '#intercom-container', '.intercom-lightweight-app', '#wm-ipp-base', '#termly-code-snippet-support'];
      sel.forEach((s) => document.querySelectorAll(s).forEach((e) => e.remove()));
      document.querySelectorAll('body *').forEach((e) => {
        const t = (e.id + ' ' + e.className).toString().toLowerCase();
        if (/cookie|consent|gdpr/.test(t)) {
          const cs = getComputedStyle(e);
          if (cs.position === 'fixed' || cs.position === 'sticky') e.remove();
        }
      });
    });
    const text = await page.evaluate(() => document.body.innerText.slice(0, 300).replace(/\s+/g, ' '));
    console.log('  text:', text);
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    console.log('  saved', name, 'height', h);
  } catch (e) {
    console.log(name, 'ERROR', e.message.split('\n')[0]);
  }
  await page.close();
  await new Promise((r) => setTimeout(r, 3000));
}
await browser.close();
