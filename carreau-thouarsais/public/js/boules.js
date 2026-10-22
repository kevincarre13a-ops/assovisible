/* Le Carreau Thouarsais — scène de pétanque animée (canvas 2D, vue du dessus)
   Des boules sont lancées vers un cochonnet, roulent, s'entrechoquent et finissent par un « carreau ».
   Utilisée dans le héros de l'accueil et dans la démo « Pourquoi Le Carreau ? ». */
(function () {
  "use strict";
  var TAU = Math.PI * 2;
  var reduced = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function rand(a, b) { return a + Math.random() * (b - a); }

  function Scene(canvas, opts) {
    this.c = canvas;
    this.ctx = canvas.getContext("2d");
    this.o = opts || {};
    this.balls = [];
    this.flights = [];
    this.puffs = [];
    this.rings = [];
    this.timeline = [];
    this.clock = 0;
    this.fade = 1;
    this.visible = false;
    this.last = 0;
    this.thrown = 0;
    this.watch = null;
    var self = this;
    this.resize();
    var rt; window.addEventListener("resize", function () { clearTimeout(rt); rt = setTimeout(function () { self.resize(); self.restart(true); }, 150); });
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        self.visible = es[0].isIntersecting;
        if (self.visible) self.start();
      }, { threshold: 0.12 }).observe(canvas);
    } else { this.visible = true; this.start(); }
    document.addEventListener("visibilitychange", function () { if (!document.hidden && self.visible) self.start(); });
  }

  Scene.prototype.resize = function () {
    var r = this.c.getBoundingClientRect();
    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.w = Math.max(1, r.width); this.h = Math.max(1, r.height);
    this.c.width = Math.round(this.w * dpr); this.c.height = Math.round(this.h * dpr);
    this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.R = clamp(Math.min(this.w, this.h * 1.5) * (this.o.scale || 0.036), 13, 31);
    this.T = this.o.target ? this.o.target(this.w, this.h) : { x: this.w * 0.7, y: this.h * 0.62 };
    this.O = this.o.origin ? this.o.origin(this.w, this.h) : { x: -this.R * 3, y: this.h * 1.02 };
  };

  /* ---- lancers ---- */
  Scene.prototype.addBall = function (x, y, kind, vx, vy) {
    var b = { x: x, y: y, vx: vx || 0, vy: vy || 0, kind: kind, r: kind === "coch" ? this.R * 0.42 : this.R,
      m: kind === "coch" ? 0.12 : 1, k: kind === "coch" ? 2.4 : 1.45, rot: rand(0, TAU), tone: rand(0, 1), born: this.clock };
    this.balls.push(b); return b;
  };
  /* Lance une boule qui retombe en (rx,ry) après `travel` px de roulage, depuis l'origine. */
  Scene.prototype.throwTo = function (rx, ry, kind, travel, speedBoost) {
    var o = this.O, dx = rx - o.x, dy = ry - o.y, d = Math.hypot(dx, dy) || 1;
    var ux = dx / d, uy = dy / d, k = kind === "coch" ? 2.4 : 1.45;
    var v0 = travel * k + 8 + (speedBoost || 0);
    var lx = rx - ux * travel, ly = ry - uy * travel;
    var dur = clamp(0.55 + d / 1500, 0.7, 1.15);
    this.flights.push({ x0: o.x, y0: o.y, x1: lx, y1: ly, ux: ux, uy: uy, v0: v0, kind: kind, t: 0, T: dur, spin: rand(0, TAU) });
    this.thrown++;
  };
  Scene.prototype.cap = function () {
    var bs = this.balls.filter(function (b) { return b.kind !== "coch"; });
    if (bs.length > 9) this.balls.splice(this.balls.indexOf(bs[0]), 1);
  };
  Scene.prototype.puff = function (x, y, n, power) {
    for (var i = 0; i < n; i++) {
      var a = rand(0, TAU), s = rand(20, 90) * power;
      this.puffs.push({ x: x, y: y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: rand(2, 5.5), life: 0, max: rand(0.5, 1.0) });
    }
  };
  Scene.prototype.ring = function (x, y, s) { this.rings.push({ x: x, y: y, life: 0, s: s }); };

  /* ---- scénarios ---- */
  Scene.prototype.reset = function () {
    this.balls = []; this.flights = []; this.puffs = []; this.rings = []; this.clock = 0; this.fade = 1; this.thrown = 0;
    this.timeline = []; this.idle = 0; this.watch = null;
  };
  Scene.prototype.at = function (t, fn) { this.timeline.push({ t: t, fn: fn, done: false }); };

  Scene.prototype.scriptHero = function () {
    var s = this, R = this.R, T = this.T;
    function P(dist, ang) { return [T.x + Math.cos(ang) * dist * R, T.y + Math.sin(ang) * dist * R]; }
    var a = P(3.0, 2.9), b = P(1.55, 1.15), c = P(4.9, -0.45);
    this.at(0.5, function () { s.throwTo(T.x, T.y, "coch", 20); });
    this.at(1.7, function () { s.throwTo(a[0], a[1], "boule", 95); });
    this.at(3.3, function () { s.throwTo(b[0], b[1], "boule", 70); });
    this.at(4.9, function () { s.throwTo(c[0], c[1], "boule", 110); });
    // le carreau : la 4e boule vise la plus proche du cochonnet (b) et prend sa place
    this.at(7.0, function () {
      var tgt = s.balls.filter(function (x) { return x.kind === "boule"; }).sort(function (p, q) {
        return Math.hypot(p.x - T.x, p.y - T.y) - Math.hypot(q.x - T.x, q.y - T.y); })[0] || { x: b[0], y: b[1] };
      s.throwTo(tgt.x, tgt.y, "boule", 3.2 * R, 120);
    });
    this.loopAt = 17;
  };
  Scene.prototype.scriptDemo = function () {
    var s = this, R = this.R, T = this.T;
    this.addBall(T.x, T.y, "coch");
    this.addBall(T.x - 1.75 * R, T.y + 0.5 * R, "boule");
    this.addBall(T.x + 2.9 * R, T.y - 1.7 * R, "boule");
    this.armed = true; this.loopAt = 0;
  };
  Scene.prototype.shoot = function () {
    if (this.o.mode !== "demo" || !this.armed) return;
    this.armed = false;
    var s = this, R = this.R, T = this.T;
    var tgt = this.balls.filter(function (b) { return b.kind === "boule"; }).sort(function (p, q) { return p.x - q.x; })[0];
    this.startPos = { x: tgt.x, y: tgt.y }; this.victim = tgt;
    this.throwTo(tgt.x, tgt.y, "boule", 3.4 * R, 150);
    this.watch = { t: 0 };
    if (this.o.onThrow) this.o.onThrow();
  };
  Scene.prototype.restart = function (soft) {
    this.reset();
    if (this.o.mode === "demo") { this.scriptDemo(); if (this.o.onReset) this.o.onReset(); }
    else this.scriptHero();
    if (reduced && this.o.mode !== "demo") this.fastForward(14);
    this.render();
  };
  Scene.prototype.fastForward = function (sec) {
    for (var t = 0; t < sec; t += 1 / 60) this.update(1 / 60);
  };
  /* clic/toucher : lance une boule vers le point visé (héros) */
  Scene.prototype.userThrow = function (x, y) {
    if (this.o.mode === "demo") return;
    this.throwTo(clamp(x, this.R, this.w - this.R), clamp(y, this.R, this.h - this.R), "boule", 80);
    this.idle = 0;
  };

  /* ---- boucle ---- */
  Scene.prototype.start = function () {
    if (this.running) return;
    if (!this.started) { this.started = true; this.restart(); }
    if (reduced) return;
    this.running = true; this.last = performance.now();
    var self = this;
    (function loop(now) {
      if (!self.visible || document.hidden) { self.running = false; return; }
      var dt = Math.min(0.05, (now - self.last) / 1000); self.last = now;
      self.update(dt); self.render();
      requestAnimationFrame(loop);
    })(this.last);
  };

  Scene.prototype.update = function (dt) {
    this.clock += dt;
    var i, j, b, f, step = 1 / 120, n = Math.max(1, Math.round(dt / step)), h = dt / n;
    for (i = 0; i < this.timeline.length; i++) { var e = this.timeline[i]; if (!e.done && this.clock >= e.t) { e.done = true; e.fn(); } }

    for (i = this.flights.length - 1; i >= 0; i--) {
      f = this.flights[i]; f.t += dt;
      if (f.t >= f.T) {
        var nb = this.addBall(f.x1, f.y1, f.kind, f.ux * f.v0, f.uy * f.v0);
        this.puff(f.x1, f.y1, f.kind === "coch" ? 6 : 10, 0.9); this.ring(f.x1, f.y1, 0.8);
        this.flights.splice(i, 1); this.cap();
      }
    }
    for (var s = 0; s < n; s++) {
      for (i = 0; i < this.balls.length; i++) {
        b = this.balls[i];
        b.x += b.vx * h; b.y += b.vy * h;
        var damp = Math.exp(-b.k * h); b.vx *= damp; b.vy *= damp;
        var sp = Math.hypot(b.vx, b.vy);
        if (sp < 5) { b.vx = b.vy = 0; } else { b.rot += sp * h / b.r; }
        if (b.x < b.r) { b.x = b.r; b.vx = Math.abs(b.vx) * 0.5; }
        if (b.x > this.w - b.r) { b.x = this.w - b.r; b.vx = -Math.abs(b.vx) * 0.5; }
        if (b.y < b.r) { b.y = b.r; b.vy = Math.abs(b.vy) * 0.5; }
        if (b.y > this.h - b.r) { b.y = this.h - b.r; b.vy = -Math.abs(b.vy) * 0.5; }
      }
      for (i = 0; i < this.balls.length; i++) for (j = i + 1; j < this.balls.length; j++) this.collide(this.balls[i], this.balls[j]);
    }
    for (i = this.puffs.length - 1; i >= 0; i--) {
      var p = this.puffs[i]; p.life += dt; p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.94; p.vy *= 0.94;
      if (p.life > p.max) this.puffs.splice(i, 1);
    }
    for (i = this.rings.length - 1; i >= 0; i--) { this.rings[i].life += dt; if (this.rings[i].life > 0.7) this.rings.splice(i, 1); }

    if (this.watch) {          // démo : détecte le « carreau »
      this.watch.t += dt;
      var moving = this.balls.some(function (x) { return x.vx || x.vy; }) || this.flights.length;
      if (!moving && this.watch.t > 0.6) {
        var thrown = this.balls[this.balls.length - 1];
        var nearOld = Math.hypot(thrown.x - this.startPos.x, thrown.y - this.startPos.y) < this.R * 1.1;
        var gone = Math.hypot(this.victim.x - this.startPos.x, this.victim.y - this.startPos.y) > this.R * 1.6;
        this.watch = null;
        if (nearOld && gone && this.o.onCarreau) this.o.onCarreau();
        else if (this.o.onMiss) this.o.onMiss();
      }
    }
    if (this.o.mode !== "demo" && this.loopAt) {   // héros : rejoue en boucle
      var moving2 = this.balls.some(function (x) { return x.vx || x.vy; }) || this.flights.length;
      if (this.clock > this.loopAt && !moving2) { this.fade -= dt * 1.4; if (this.fade <= 0) { this.restart(); } }
    }
  };

  Scene.prototype.collide = function (a, b) {
    var dx = b.x - a.x, dy = b.y - a.y, d = Math.hypot(dx, dy), min = a.r + b.r;
    if (d >= min || d === 0) return;
    var nx = dx / d, ny = dy / d, over = min - d, tm = a.m + b.m;
    a.x -= nx * over * (b.m / tm); a.y -= ny * over * (b.m / tm);
    b.x += nx * over * (a.m / tm); b.y += ny * over * (a.m / tm);
    var rvx = b.vx - a.vx, rvy = b.vy - a.vy, vn = rvx * nx + rvy * ny;
    if (vn > 0) return;
    var e = 0.93, j = -(1 + e) * vn / (1 / a.m + 1 / b.m);
    a.vx -= j * nx / a.m; a.vy -= j * ny / a.m; b.vx += j * nx / b.m; b.vy += j * ny / b.m;
    if (-vn > 60) { var cx = a.x + nx * a.r, cy = a.y + ny * a.r; this.puff(cx, cy, 8, clamp(-vn / 200, 0.5, 2)); this.ring(cx, cy, clamp(-vn / 260, 0.6, 1.6)); }
  };

  /* ---- rendu ---- */
  Scene.prototype.drawBall = function (x, y, b, scale, z, alpha) {
    var ctx = this.ctx, r = b.r * scale, isC = b.kind === "coch";
    ctx.save(); ctx.globalAlpha = alpha;
    // ombre portée (s'éloigne quand la boule est en l'air)
    var so = r * (0.28 + z * 1.6);
    var g = ctx.createRadialGradient(x + so * 0.7, y + so, r * 0.1, x + so * 0.7, y + so, r * 1.25);
    g.addColorStop(0, "rgba(45,28,6," + (0.46 - z * 0.22) + ")"); g.addColorStop(1, "rgba(45,28,6,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x + so * 0.7, y + so, r * 1.25, 0, TAU); ctx.fill();
    // corps
    var bg = ctx.createRadialGradient(x - r * 0.38, y - r * 0.42, r * 0.06, x, y, r * 1.12);
    if (isC) { bg.addColorStop(0, "#ffd9cd"); bg.addColorStop(0.35, "#e8523b"); bg.addColorStop(1, "#7d1710"); }
    else { bg.addColorStop(0, "#ffffff"); bg.addColorStop(0.16, "#e3e9ee"); bg.addColorStop(0.52, "#9aa7b4"); bg.addColorStop(0.86, "#4a5764"); bg.addColorStop(1, "#222b36"); }
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill();
    if (!isC) {   // stries qui tournent avec le roulement
      ctx.lineWidth = Math.max(1, r * 0.075); ctx.strokeStyle = "rgba(18,26,36,.34)"; ctx.lineCap = "round";
      ctx.beginPath(); ctx.arc(x, y, r * 0.5, b.rot, b.rot + 4.1); ctx.stroke();
      ctx.beginPath(); ctx.arc(x, y, r * 0.76, b.rot + 2.4, b.rot + 5.6); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,.28)";
      ctx.beginPath(); ctx.arc(x + r * 0.03, y + r * 0.03, r * 0.5, b.rot + 0.1, b.rot + 0.9); ctx.stroke();
    }
    // reflet
    ctx.fillStyle = "rgba(255,255,255," + (isC ? 0.55 : 0.8) + ")";
    ctx.beginPath(); ctx.ellipse(x - r * 0.4, y - r * 0.46, r * 0.24, r * 0.14, -0.7, 0, TAU); ctx.fill();
    ctx.restore();
  };

  Scene.prototype.render = function () {
    var ctx = this.ctx, i; ctx.clearRect(0, 0, this.w, this.h);
    var fade = clamp(this.fade, 0, 1);
    for (i = 0; i < this.rings.length; i++) {
      var rg = this.rings[i], k = rg.life / 0.7;
      ctx.strokeStyle = "rgba(255,240,205," + (0.55 * (1 - k)) + ")"; ctx.lineWidth = 3 * (1 - k) + 1;
      ctx.beginPath(); ctx.arc(rg.x, rg.y, this.R * (0.6 + k * 2.4 * rg.s), 0, TAU); ctx.stroke();
    }
    var sorted = this.balls.slice().sort(function (a, b) { return a.y - b.y; });
    for (i = 0; i < sorted.length; i++) this.drawBall(sorted[i].x, sorted[i].y, sorted[i], 1, 0, fade);
    for (i = 0; i < this.flights.length; i++) {
      var f = this.flights[i], p = clamp(f.t / f.T, 0, 1), z = 4 * p * (1 - p);
      var e = 1 - Math.pow(1 - p, 1.6);
      var fake = { r: f.kind === "coch" ? this.R * 0.42 : this.R, kind: f.kind, rot: f.spin + p * 9 };
      this.drawBall(f.x0 + (f.x1 - f.x0) * e, f.y0 + (f.y1 - f.y0) * e - z * this.R * 2.2, fake, 1 + z * 0.55, z, fade);
    }
    for (i = 0; i < this.puffs.length; i++) {
      var q = this.puffs[i], a = 1 - q.life / q.max;
      ctx.fillStyle = "rgba(214,176,110," + (0.65 * a) + ")"; ctx.beginPath(); ctx.arc(q.x, q.y, q.r * (1 + q.life), 0, TAU); ctx.fill();
    }
  };

  window.CarreauScene = Scene;
})();
