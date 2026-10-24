/* Héros : le volant traverse l'écran en laissant une traînée pointillée */
(() => {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const hero = document.getElementById('hero'), s = document.getElementById('shuttle'),
        trail = document.getElementById('trailPath');
  if (!hero || !s) return;
  const DUR = 3200, PAUSE = 2600;
  let t0 = null, pts = [], size = 100;

  const plan = () => {
    const W = hero.clientWidth, H = hero.clientHeight;
    size = s.getBoundingClientRect().width || 100;
    const mobile = W < 700;
    const a = { x: -size, y: H * (mobile ? .62 : .72) };
    const c = { x: W * .5, y: H * (mobile ? -.05 : -.12) };
    const b = { x: W + size, y: H * (mobile ? .42 : .5) };
    pts = [a, c, b];
  };
  const at = u => {
    const [a, c, b] = pts, m = 1 - u;
    return {
      x: m * m * a.x + 2 * m * u * c.x + u * u * b.x,
      y: m * m * a.y + 2 * m * u * c.y + u * u * b.y,
      dx: 2 * m * (c.x - a.x) + 2 * u * (b.x - c.x),
      dy: 2 * m * (c.y - a.y) + 2 * u * (b.y - c.y)
    };
  };
  const frame = now => {
    if (t0 === null) t0 = now;
    const e = (now - t0) % (DUR + PAUSE);
    if (e > DUR) { s.style.opacity = 0; trail.setAttribute('d', ''); requestAnimationFrame(frame); return; }
    const u = Math.min(1, e / DUR), p = at(u);
    const ang = Math.atan2(p.dy, p.dx) * 180 / Math.PI - 90; // bouchon en avant
    s.style.opacity = u < .04 ? u / .04 : u > .96 ? (1 - u) / .04 : 1;
    s.style.transform = `translate(${p.x - size / 2}px,${p.y - size / 2}px) rotate(${ang}deg) scale(${.85 + Math.sin(u * Math.PI) * .35})`;
    let d = '';
    for (let k = Math.max(0, u - .45); k <= u; k += .02) { const q = at(k); d += (d ? 'L' : 'M') + q.x.toFixed(1) + ',' + q.y.toFixed(1); }
    trail.setAttribute('d', d);
    requestAnimationFrame(frame);
  };
  plan(); addEventListener('resize', plan);
  let visible = true;
  new IntersectionObserver(es => { visible = es[0].isIntersecting; }).observe(hero);
  const loop = now => visible ? frame(now) : requestAnimationFrame(loop);
  requestAnimationFrame(loop);
})();
