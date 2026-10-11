// Shared plumbing for the animated exhibit diagrams: each one plays a scripted loop while it's on screen.
// With reduced motion the loop never starts and the diagram rests on its finished state.

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const fmt = (n: number) => n.toFixed(1);

// Eases a number from `from` to `to`, writing it into `el`.
export function countTo(el: Element, from: number, to: number, ms: number) {
  const t0 = performance.now();
  return new Promise<void>((done) => {
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      el.textContent = fmt(from + (to - from) * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
      else done();
    };
    requestAnimationFrame(tick);
  });
}

// Types `text` into `el` one character at a time.
export async function type(el: Element, text: string, perChar: number) {
  for (let i = 1; i <= text.length; i++) {
    el.textContent = text.slice(0, i);
    await sleep(perChar);
  }
}

// Swaps a status line: fade out, change the words, fade back in.
export async function say(el: Element, text: string) {
  el.classList.remove('on');
  await sleep(150);
  el.textContent = text;
  el.classList.add('on');
}

// Runs `turn` over and over while `svg` is on screen. Marks it `.live` so CSS hides what the turn reveals.
export function loopWhileVisible(svg: SVGSVGElement, turn: () => Promise<void>) {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let visible = false;
  let running = false;
  const loop = async () => {
    if (running) return;
    running = true;
    svg.classList.add('live');
    while (visible) await turn();
    running = false;
  };
  new IntersectionObserver(
    ([e]) => {
      visible = e.isIntersecting;
      if (visible) loop();
    },
    { threshold: 0.4 },
  ).observe(svg);
}
