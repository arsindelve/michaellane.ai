// Records a real play session of each game as an animated WebP for the exhibits.
// Frames are captured per keystroke and per response, then given their own display
// times, so the result reads naturally no matter how slow the capture or the AI is.
// Usage: node scripts/animate.mjs [zork|planetfall ...]   (uses the locally installed Chrome)
import { chromium } from 'playwright-core';
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT = fileURLToPath(new URL('../public/anim/', import.meta.url));
await mkdir(OUT, { recursive: true });

const sessions = {
  zork: {
    url: 'https://newzork.ai',
    commands: ['eat the mailbox', 'take the house', 'tell me a joke', 'kick the white house'],
  },
  planetfall: {
    url: 'https://planetfall.ai',
    commands: [
      'sing the Stellar Patrol anthem',
      'ask the scrub brush for career advice',
      'do twenty pushups',
      'polish the deck with my sleeve',
      'ask the ambassador about the celery',
    ],
  },
};

// The Manifest Chronicles: create a character, then walk a fixed route through level 1.
// Recording starts just before the long east corridor comes into view.
async function recordManifest(page) {
  const frames = [];
  const snap = async (delay) => frames.push({ buf: await page.screenshot({ type: 'png' }), delay });
  await page.goto('https://arsindelve.github.io/manifest-chronicles/', { waitUntil: 'networkidle' });
  const type = async (t, w = 1200) => {
    await page.keyboard.type(t);
    await page.keyboard.press('Enter');
    await page.waitForTimeout(w);
  };
  await page.keyboard.press('Space');
  await page.waitForTimeout(6000);
  await page.keyboard.press('Space');
  await page.waitForTimeout(1200);
  for (const t of ['s', 'Michael', 'Floyd', '2', '1']) await type(t);
  await type('y', 2000);
  for (let i = 0; i < 6; i++) {
    await page.keyboard.press('Space');
    await page.waitForTimeout(2500);
  }
  const keys = { U: 'ArrowUp', L: 'ArrowLeft', R: 'ArrowRight' };
  const walk = async (route, record) => {
    for (const k of route) {
      await page.keyboard.press(keys[k]);
      await page.waitForTimeout(650);
      if (record) await snap(k === 'U' ? 700 : 1100);
    }
  };
  await walk('UUULUUURUUUU', false);
  await snap(1200);
  await walk('RRUUULUUUU', true);
  frames[frames.length - 1].delay += 1500;
  return frames;
}

const VIEWPORT = { width: 1280, height: 800 };
const SPINNER = '[role="progressbar"], .MuiCircularProgress-root';

async function record(page, { url, commands }) {
  const frames = [];
  const snap = async (delay) => frames.push({ buf: await page.screenshot({ type: 'png' }), delay });

  await page.goto(url, { waitUntil: 'networkidle' });
  await page.getByRole('button', { name: 'CLOSE' }).click({ timeout: 15000 });
  await page.waitForTimeout(800);
  const input = page.locator('input[placeholder^="Type your command"]');
  await input.click();
  await snap(1800);

  for (const cmd of commands) {
    // Type two characters per frame.
    for (let i = 0; i < cmd.length; i += 2) {
      await input.pressSequentially(cmd.slice(i, i + 2));
      await snap(85);
    }
    await snap(450);
    await input.press('Enter');
    // A few frames of the spinner, compressed in time.
    for (let i = 0; i < 4; i++) {
      await page.waitForTimeout(400);
      if (!(await page.locator(SPINNER).count())) break;
      await snap(200);
    }
    await page.locator(SPINNER).first().waitFor({ state: 'detached', timeout: 60000 }).catch(() => {});
    await page.waitForTimeout(1500);
    // Hold long enough to read the reply.
    await snap(4200);
  }
  frames[frames.length - 1].delay += 1500;
  return frames;
}

const wanted = process.argv.slice(2).length ? process.argv.slice(2) : [...Object.keys(sessions), 'manifest'];
const browser = await chromium.launch({ channel: 'chrome' });
for (const name of wanted) {
  const page = await browser.newPage({ viewport: VIEWPORT, colorScheme: 'dark' });
  const frames = name === 'manifest' ? await recordManifest(page) : await record(page, sessions[name]);
  await page.close();
  await sharp(
    frames.map((f) => f.buf),
    { join: { animated: true }, limitInputPixels: false },
  )
    .webp({ quality: 82, effort: 5, loop: 0, delay: frames.map((f) => f.delay) })
    .toFile(OUT + `${name}.webp`);
  // A still of the final frame, for people who prefer reduced motion.
  await sharp(frames[frames.length - 1].buf).webp({ quality: 85 }).toFile(OUT + `${name}-still.webp`);
  const seconds = frames.reduce((t, f) => t + f.delay, 0) / 1000;
  console.log(`ok ${name}: ${frames.length} frames, ${seconds.toFixed(1)}s`);
}
await browser.close();
