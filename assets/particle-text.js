/* React Bits ParticleText — vanilla port.
   Gathers into the headline on load, drifts at rest, repels from the pointer.
   Palette follows the Articulate Materials theme: #e2e8f0 -> #34d399. */
(function () {
  'use strict';

  var wrap = document.getElementById('particleTitle');
  if (!wrap) return;
  var canvas = wrap.querySelector('canvas');
  var ctx = canvas.getContext('2d');
  if (!ctx) return;

  var TEXT = wrap.getAttribute('aria-label') || '';
  var BASE = [226, 232, 240];
  var HIGHLIGHT = [52, 211, 153];
  var DENSITY = 4;
  var MAX_PARTICLES = 5200;
  var PARTICLE_SIZE = 1.7;
  var SCATTER = 140;
  var GATHER_MS = 1600;
  var IDLE_DRIFT = 5;
  var REPEL_RADIUS = 130;
  var POINTER_REPEL = 30;

  var dpr = 1, W = 0, H = 0;
  var particles = [];
  var startGatherAt = 0;
  var pointer = { x: -9999, y: -9999, sx: -9999, sy: -9999 };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var buildId = 0;

  function clamp(v, lo, hi) { return v < lo ? lo : (v > hi ? hi : v); }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }
  function mixRgb(a, b, t) {
    return 'rgb(' + Math.round(a[0] + (b[0] - a[0]) * t) + ',' +
                    Math.round(a[1] + (b[1] - a[1]) * t) + ',' +
                    Math.round(a[2] + (b[2] - a[2]) * t) + ')';
  }

  function resize() {
    var rect = wrap.getBoundingClientRect();
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.max(1, Math.floor(rect.width));
    H = Math.max(1, Math.floor(rect.height));
    canvas.width = Math.floor(W * dpr);
    canvas.height = Math.floor(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    sampleText();
  }

  function sampleText() {
    var myBuild = ++buildId;
    var fontFam = getComputedStyle(wrap).fontFamily;
    var off = document.createElement('canvas');
    var octx = off.getContext('2d');
    if (!octx) return;

    var probe = document.createElement('span');
    probe.style.cssText = 'position:absolute;visibility:hidden;white-space:nowrap;' +
      'font-family:' + fontFam + ';font-weight:800;letter-spacing:-.02em;';
    probe.textContent = TEXT;
    wrap.appendChild(probe);
    var size = parseFloat(getComputedStyle(probe).fontSize) || 64;
    probe.remove();

    off.width = Math.max(1, Math.floor(W * dpr));
    off.height = Math.max(1, Math.floor(H * dpr));
    octx.setTransform(dpr, 0, 0, dpr, 0, 0);
    octx.fillStyle = '#fff';
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';

    var words = TEXT.split(/\s+/).filter(Boolean);
    var size = parseFloat(getComputedStyle(probe).fontSize) || 64;
    var lines = [], widest = 0, tries = 0;
    while (tries++ < 24) {
      octx.font = '800 ' + size + 'px ' + fontFam;
      var best = null;
      var widths = [0.92, 0.86, 0.80, 0.74];
      for (var wi = 0; wi < widths.length; wi++) {
        var maxW = W * widths[wi];
        var ls = [], cur = '';
        for (var w = 0; w < words.length; w++) {
          var trial = cur ? cur + ' ' + words[w] : words[w];
          if (octx.measureText(trial).width <= maxW || !cur) cur = trial;
          else { ls.push(cur); cur = words[w]; }
        }
        if (cur) ls.push(cur);
        var ww = 0;
        for (var i = 0; i < ls.length; i++) {
          ww = Math.max(ww, octx.measureText(ls[i]).width);
        }
        var lastWords = (ls[ls.length - 1] || '').split(' ').length;
        var score = ls.length * 10 + (lastWords <= 2 ? 6 : 0) - ww / W;
        if (!best || score < best.score) best = { lines: ls, widest: ww, score: score };
      }
      lines = best.lines; widest = best.widest;
      if (lines.length <= 3 && widest <= W * 0.92) break;
      size *= 0.95;
    }
    var lh = size * 1.12;
    var y0 = H / 2 - ((lines.length - 1) * lh) / 2;
    for (var j = 0; j < lines.length; j++) octx.fillText(lines[j], W / 2, y0 + j * lh);

    var img;
    try { img = octx.getImageData(0, 0, off.width, off.height); }
    catch (e) { return; }
    if (myBuild !== buildId) return;

    var data = img.data;
    var raw = [];
    for (var y = 0; y < off.height; y += DENSITY) {
      for (var x = 0; x < off.width; x += DENSITY) {
        if (data[(y * off.width + x) * 4 + 3] > 40) raw.push([x, y]);
      }
    }
    var maxP = clamp(Math.floor((W * H) / 90), 900, MAX_PARTICLES);
    var stride = Math.max(1, Math.ceil(raw.length / maxP));
    var out = [];
    for (var k = 0; k < raw.length; k += stride) {
      var px = raw[k][0] / dpr, py = raw[k][1] / dpr;
      var seed = Math.random();
      var ang = Math.random() * Math.PI * 2;
      var dist = SCATTER * (0.4 + Math.random() * 0.6);
      var blend = clamp(px / W + (seed - 0.5) * 0.35, 0, 1);
      out.push({
        tx: px, ty: py,
        x: px + Math.cos(ang) * dist,
        y: py + Math.sin(ang) * dist,
        sx: px, sy: py,
        seed: seed,
        depth: 0.4 + Math.random() * 0.6,
        delay: seed * 600,
        color: mixRgb(BASE, HIGHLIGHT, blend)
      });
    }
    particles = out;
    startGatherAt = performance.now();
    if (reduceMotion.matches) {
      for (var m = 0; m < particles.length; m++) {
        particles[m].x = particles[m].tx;
        particles[m].y = particles[m].ty;
      }
      startGatherAt = -1e9;
    }
  }

  function frame(now) {
    ctx.clearRect(0, 0, W, H);
    var t = now / 1000;
    var gathering = startGatherAt > 0 && startGatherAt > -1e8;
    var gt = gathering ? clamp((now - startGatherAt) / GATHER_MS, 0, 1) : 1;
    pointer.sx += (pointer.x - pointer.sx) * 0.18;
    pointer.sy += (pointer.y - pointer.sy) * 0.18;

    ctx.shadowBlur = PARTICLE_SIZE * 3;
    ctx.shadowColor = 'rgb(' + HIGHLIGHT[0] + ',' + HIGHLIGHT[1] + ',' + HIGHLIGHT[2] + ')';

    for (var i = 0; i < particles.length; i++) {
      var p = particles[i];
      var px, py;
      if (gathering) {
        var local = clamp((gt * GATHER_MS - p.delay) / Math.max(1, GATHER_MS - p.delay), 0, 1);
        var e = easeOutCubic(local);
        px = p.sx + (p.tx - p.sx) * e;
        py = p.sy + (p.ty - p.sy) * e;
      } else {
        px = p.tx + Math.sin(t * 0.9 + p.seed * 10) * IDLE_DRIFT * p.depth;
        py = p.ty + Math.cos(t * 0.8 + p.seed * 12) * IDLE_DRIFT * p.depth;
      }
      var dx = px - pointer.sx, dy = py - pointer.sy;
      var d = Math.sqrt(dx * dx + dy * dy);
      if (d < REPEL_RADIUS && d > 0.01) {
        var f = Math.pow(1 - d / REPEL_RADIUS, 2) * POINTER_REPEL;
        px += (dx / d) * f;
        py += (dy / d) * f;
      }
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(px, py, PARTICLE_SIZE, 0, 6.2832);
      ctx.fill();
    }
    requestAnimationFrame(frame);
  }

  wrap.addEventListener('pointermove', function (ev) {
    var r = wrap.getBoundingClientRect();
    pointer.x = ev.clientX - r.left;
    pointer.y = ev.clientY - r.top;
  });
  wrap.addEventListener('pointerleave', function () {
    pointer.x = -9999; pointer.y = -9999;
  });

  function onMotionChange() { sampleText(); }
  if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', onMotionChange);

  var rafPending = false;
  function onResize() {
    if (rafPending) return;
    rafPending = true;
    requestAnimationFrame(function () { rafPending = false; resize(); });
  }
  if (window.ResizeObserver) new ResizeObserver(onResize).observe(wrap);
  else window.addEventListener('resize', onResize);

  function start() {
    resize();
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(function () { resize(); });
    }
    requestAnimationFrame(frame);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
