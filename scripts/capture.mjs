// Captures screenshots of the live projects for the showcase.
// Usage: node scripts/capture.mjs [name ...]   (uses the locally installed Chrome)
import { chromium } from 'playwright-core';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../src/assets/shots/', import.meta.url));
await mkdir(OUT, { recursive: true });

async function play(page, commands) {
  const input = page.locator('input[placeholder^="Type your command"]');
  for (const cmd of commands) {
    await input.fill(cmd);
    await input.press('Enter');
    // AI responses take a few seconds; wait for the spinner to go away.
    await page.waitForTimeout(1000);
    await page
      .locator('[role="progressbar"], .MuiCircularProgress-root')
      .first()
      .waitFor({ state: 'detached', timeout: 60000 })
      .catch(() => {});
    await page.waitForTimeout(1500);
  }
}

async function closeWelcome(page) {
  await page.getByRole('button', { name: 'CLOSE' }).click({ timeout: 15000 });
  await page.waitForTimeout(500);
}

const shots = {
  async newzork(page) {
    await page.goto('https://newzork.ai', { waitUntil: 'networkidle' });
    await closeWelcome(page);
    await play(page, ['open the mailbox', 'read the leaflet', 'ask the mailbox if it gets lonely out here']);
  },
  async planetfall(page) {
    await page.goto('https://planetfall.ai', { waitUntil: 'networkidle' });
    await closeWelcome(page);
    await play(page, ['scrub the deck with great enthusiasm', 'sing the Stellar Patrol anthem']);
  },
  async manifest(page) {
    await page.goto('https://arsindelve.github.io/manifest-chronicles/', { waitUntil: 'networkidle' });
    const type = async (text, wait = 1200) => {
      await page.keyboard.type(text);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(wait);
    };
    await page.keyboard.press('Space');
    await page.waitForTimeout(6000); // title animation
    await page.keyboard.press('Space');
    await page.waitForTimeout(1200);
    await type('s');
    await type('Michael');
    await type('Floyd');
    await page.screenshot({ path: OUT + 'manifest-race.png' });
    await type('2');
    await type('1');
    await type('y', 2000);
    // Instructions and story pages: keep pressing until the dungeon appears.
    for (let i = 0; i < 6; i++) {
      await page.keyboard.press('Space');
      await page.waitForTimeout(2500);
    }
  },
  async unopened(page) {
    await page.goto('https://unopenedworlds.com', { waitUntil: 'networkidle' });
    await page.locator('#collection').scrollIntoViewIfNeeded();
    await page.evaluate(() => document.querySelector('#collection')?.scrollIntoView({ block: 'start' }));
    await page.waitForTimeout(2500);
  },
};

const wanted = process.argv.slice(2).length ? process.argv.slice(2) : Object.keys(shots);
const browser = await chromium.launch({ channel: 'chrome' });
for (const name of wanted) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, colorScheme: 'dark' });
  try {
    await shots[name](page);
    await page.screenshot({ path: OUT + `${name}.png` });
    console.log(`ok ${name}`);
  } catch (e) {
    await page.screenshot({ path: OUT + `${name}-failed.png` });
    console.log(`FAILED ${name}: ${e.message.split('\n')[0]}`);
  }
  await page.close();
}
await browser.close();
