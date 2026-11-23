/* Articulate Materials portal — interactions.
   Vanilla ports of React Bits patterns: theme picker, spotlight cards, tooltip,
   CountUp, CircularGallery. One shared rAF for the gallery. */
(function () {
  'use strict';

  var REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ─────────────── theme picker ─────────────── */
  var THEMES = [
    ['violet', '#a78bfa'], ['forest', '#34d399'], ['indigo', '#818cf8'],
    ['cyan', '#22d3ee'], ['gold', '#f59e0b'], ['rose', '#fb7185'], ['classic', '#fbbf24']
  ];
  var picker = document.getElementById('themePicker');
  var current = 'violet';
  try { current = localStorage.getItem('am-theme') || 'violet'; } catch (e) {}
  THEMES.forEach(function (t) {
    var b = document.createElement('button');
    b.type = 'button';
    b.style.background = t[1];
    b.title = t[0];
    b.setAttribute('aria-label', t[0] + ' theme');
    b.setAttribute('aria-pressed', String(t[0] === current));
    b.addEventListener('click', function () { setTheme(t[0]); });
    picker.appendChild(b);
  });
  function setTheme(name) {
    current = name;
    document.documentElement.setAttribute('data-theme', name);
    try { localStorage.setItem('am-theme', name); } catch (e) {}
    Array.prototype.forEach.call(picker.children, function (b, i) {
      b.setAttribute('aria-pressed', String(THEMES[i][0] === name));
    });
  }
  setTheme(current);

  /* ─────────────── data ─────────────── */
  var PAYHIP = 'https://payhip.com/ArticulateEnglishESLLessons';

  var SAMPLES = [
    {
      title: 'B2 Speaking Decks', href: 'b2-speaking/index.html',
      img: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=900&q=75',
      alt: 'A person exercising indoors',
      meta: 'Free', desc: 'Three exam-style decks: Health & Fitness, Work & Future Plans, The Internet & AI.',
      tip: '<strong>B2 Speaking Decks</strong><em>Part 1 interview, Part 2 photo comparison and Part 3 discussion, each with model answers. Three of the twelve decks are free; the rest are in the library.</em>'
    },
    {
      title: 'Sliding In — free topics', href: 'https://articulate-english.github.io/sliding-in/',
      img: 'assets/img/free-slide-01.jpg', alt: 'A Sliding In question slide',
      meta: 'Free', desc: 'Four free topics from the open-ended speaking decks, with model answers.',
      tip: '<strong>Sliding In</strong><em>Open-ended discussion questions with a model answer on every slide. Each deck opens with four free topics you can try in class today.</em>'
    }
  ];

  var PRODUCTS = [
    {
      title: 'Sliding In 1', href: PAYHIP, img: 'assets/img/cover-sliding-in-1.jpg',
      alt: 'Sliding In 1 cover', cls: 'card--feature',
      meta: '366 questions · 27 topics', price: '$24',
      desc: 'The first open-ended speaking deck: age, appearance, childhood, choices and 23 more.',
      tip: '<strong>Sliding In 1</strong><em>366 open-ended questions across 27 topics, with a model answer on every slide and an optional shuffle. Installs as an app and works offline.</em>'
    },
    {
      title: 'Sliding In 2', href: PAYHIP, img: 'assets/img/cover-sliding-in-2.jpg',
      alt: 'Sliding In 2 cover', meta: '378 questions · 27 topics', price: '$24',
      desc: 'Books, describing people, work, and the language of explanation.',
      tip: '<strong>Sliding In 2</strong><em>378 open-ended questions across 27 topics. The strongest vocabulary range of the four decks.</em>'
    },
    {
      title: 'Sliding In 3', href: PAYHIP, img: 'assets/img/cover-sliding-in-3.jpg',
      alt: 'Sliding In 3 cover', meta: '363 questions · 27 topics', price: '$24',
      desc: 'Privacy, law and justice, politics, and the language of argument.',
      tip: '<strong>Sliding In 3</strong><em>363 open-ended questions across 27 topics, built for learners who want to argue a position.</em>'
    },
    {
      title: 'Sliding In 4', href: PAYHIP, img: 'assets/img/cover-sliding-in-4.jpg',
      alt: 'Sliding In 4 cover', meta: '345 questions · 26 topics', price: '$24',
      desc: 'Travel, driving, conversation openings and introductions.',
      tip: '<strong>Sliding In 4</strong><em>345 open-ended questions across 26 topics, weighted towards everyday and travel conversation.</em>'
    },
    {
      title: 'Complete Collection', href: PAYHIP, img: 'assets/img/cover-complete-collection.jpg',
      alt: 'Complete collection cover', cls: 'card--wide',
      meta: '1,452 questions · 107 topics', price: '$75',
      desc: 'All four decks in one download, with the Anki deck included.',
      tip: '<strong>Complete Collection</strong><em>Every Sliding In question — 1,452 across 107 topics — in one download. Best value per question.</em>'
    },
    {
      title: 'Anki Deck', href: PAYHIP, img: 'assets/img/cover-anki-deck.jpg',
      alt: 'Anki deck cover', meta: '1,452 cards', price: '$16',
      desc: 'All 1,452 questions formatted as Anki cards, ready to import.',
      tip: '<strong>Anki Deck</strong><em>All 1,452 Sliding In questions as importable Anki cards, one question per card with the model answer on the back.</em>'
    },
    {
      title: 'B2 Speaking Decks', href: 'b2-speaking/index.html',
      img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=900&q=75',
      alt: 'A person writing at a desk', meta: '12 decks · 3 free',
      desc: 'Exam-style speaking practice with Part 1, Part 2 and Part 3 tasks.',
      tip: '<strong>B2 Speaking Decks</strong><em>Twelve exam-style decks. Three are free to use here; the other nine are part of the full library download.</em>'
    },
    {
      title: 'IELTS Speaking Practice', href: PAYHIP,
      img: 'assets/img/free-slide-05.jpg', alt: 'An IELTS speaking practice slide',
      meta: '47 mock exams', desc: 'Topic-based mock exams with Part 1, Part 2 and Part 3 tasks.',
      tip: '<strong>IELTS Speaking Practice</strong><em>47 topic-based mock exams. Part of the full library download.</em>'
    },
    {
      title: 'Speak Easily Kids', href: 'https://articulate-english.github.io/speak-easily-kids/',
      img: 'assets/img/free-slide-08.jpg', alt: 'A kids speaking practice slide',
      meta: '240 questions · 4 topics free', price: '$16',
      desc: 'Topic-based speaking questions for younger learners. Four topics free, all twenty paid.',
      tip: '<strong>Speak Easily Kids</strong><em>240 topic-based speaking questions for ages 9–12 across 20 topics. Four topics are free; the other sixteen come with the one-off purchase.</em>'
    }
  ];

  var SHOTS = [
    ['assets/img/deck1-library.jpg', 'Sliding In 1 — the lesson library'],
    ['assets/img/deck2-library.jpg', 'Sliding In 2 — the lesson library'],
    ['assets/img/deck3-library.jpg', 'Sliding In 3 — the lesson library'],
    ['assets/img/deck4-library.jpg', 'Sliding In 4 — the lesson library'],
    ['assets/img/free-slide-02.jpg', 'A free question slide with model answers'],
    ['assets/img/free-slide-03.jpg', 'Vocabulary with hover definitions'],
    ['assets/img/free-slide-04.jpg', 'Part 2 photo comparison'],
    ['assets/img/free-slide-06.jpg', 'Part 3 discussion questions'],
    ['assets/img/free-slide-09.jpg', 'The full deck view']
  ];

  /* ─────────────── card rendering ─────────────── */
  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  function cardHTML(d) {
    var price = d.price ? '<span class="tag tag--paid">' + esc(d.price) + '</span>' : '';
    var freeTag = d.meta ? '<span class="tag">' + esc(d.meta) + '</span>' : '';
    return '<a class="card ' + (d.cls || '') + '" href="' + esc(d.href) + '"' +
        ' data-tip="' + esc(d.tip) + '"' +
        ' aria-label="' + esc(d.title) + '">' +
        '<img src="' + esc(d.img) + '" alt="' + esc(d.alt) + '" loading="lazy" width="900" height="600">' +
        '<div class="body">' +
          '<div class="meta">' + freeTag + price + '</div>' +
          '<h3>' + esc(d.title) + '</h3>' +
          '<p class="desc">' + esc(d.desc) + '</p>' +
          '<span class="go">Open</span>' +
        '</div>' +
      '</a>';
  }

  document.getElementById('sampleGrid').innerHTML = SAMPLES.map(cardHTML).join('');
  document.getElementById('productGrid').innerHTML = PRODUCTS.map(cardHTML).join('');
  document.getElementById('sampleCount').textContent = SAMPLES.length + ' free';
  document.getElementById('productCount').textContent = PRODUCTS.length + ' products';

  /* ─────────────── spotlight + tooltip ─────────────── */
  var tip = document.getElementById('tip');
  var tipFor = null;

  Array.prototype.forEach.call(document.querySelectorAll('.card'), function (el) {
    el.addEventListener('pointermove', function (ev) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (ev.clientX - r.left) + 'px');
      el.style.setProperty('--my', (ev.clientY - r.top) + 'px');
    });
    el.addEventListener('pointerenter', function () { showTip(el); });
    el.addEventListener('pointerleave', hideTip);
    el.addEventListener('focus', function () {
      var r = el.getBoundingClientRect();
      placeTip(r.left + r.width / 2, r.top);
      tip.innerHTML = el.getAttribute('data-tip');
      tip.classList.add('show');
    });
    el.addEventListener('blur', hideTip);
  });

  function showTip(el) {
    tipFor = el;
    tip.innerHTML = el.getAttribute('data-tip');
    tip.classList.add('show');
    document.addEventListener('pointermove', moveTip);
  }
  function moveTip(ev) {
    if (!tipFor) return;
    placeTip(ev.clientX, ev.clientY);
  }
  function placeTip(x, y) {
    var pad = 14;
    var r = tip.getBoundingClientRect();
    var left = x + pad, top = y + pad;
    if (left + r.width > window.innerWidth - 8) left = x - r.width - pad;
    if (top + r.height > window.innerHeight - 8) top = y - r.height - pad;
    tip.style.left = Math.max(8, left) + 'px';
    tip.style.top = Math.max(8, top) + 'px';
  }
  function hideTip() {
    tipFor = null;
    tip.classList.remove('show');
    document.removeEventListener('pointermove', moveTip);
  }

  /* hero spotlight */
  var hero = document.getElementById('heroPanel');
  if (hero) {
    hero.addEventListener('pointermove', function (ev) {
      var r = hero.getBoundingClientRect();
      hero.style.setProperty('--hx', ((ev.clientX - r.left) / r.width * 100) + '%');
      hero.style.setProperty('--hy', ((ev.clientY - r.top) / r.height * 100) + '%');
    });
  }

  /* ─────────────── CountUp ─────────────── */
  var counted = false;
  function countUp() {
    if (counted || REDUCED.matches) {
      Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (b) {
        b.textContent = b.getAttribute('data-count');
      });
      return;
    }
    counted = true;
    Array.prototype.forEach.call(document.querySelectorAll('[data-count]'), function (b) {
      var target = parseInt(b.getAttribute('data-count'), 10) || 0;
      var t0 = performance.now(), dur = 1200;
      function step(now) {
        var p = Math.min(1, (now - t0) / dur);
        b.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { if (e.isIntersecting) { countUp(); io.disconnect(); } });
    }, { threshold: .3 });
    io.observe(document.querySelector('.stats'));
  } else {
    countUp();
  }

  /* ─────────────── CircularGallery ─────────────── */
  var ring = document.getElementById('galRing');
  var stage = document.getElementById('galStage');
  if (ring && stage) {
    var N = SHOTS.length;
    var radius = 460;
    var angle = 0;              // current rotation, degrees
    var vel = 0;                // release velocity, degrees/second
    var glideTarget = null;     // when set, ease toward this angle
    var dragging = false, startX = 0, startAngle = 0;
    var lastX = 0, lastMoveT = 0, lastDX = 0;
    var idleT = 99;             // seconds since the last interaction
    var lastFrame = performance.now();
    var AUTO_DELAY = 2.8;       // pause before the idle glide resumes
    var AUTO_SPEED = 3.0;       // degrees/second once the idle glide is at full speed
    var FRICTION = Math.log(0.045);   // per-second velocity decay constant (negative)

    SHOTS.forEach(function (s, i) {
      var a = (360 / N) * i;
      var fig = document.createElement('figure');
      fig.className = 'shot';
      fig.style.transform = 'rotateY(' + a + 'deg) translateZ(' + radius + 'px)';
      fig.innerHTML = '<img src="' + esc(s[0]) + '" alt="' + esc(s[1]) + '" loading="lazy"><figcaption>' + esc(s[1]) + '</figcaption>';
      ring.appendChild(fig);
    });

    function layout() {
      var w = stage.clientWidth;
      radius = Math.max(240, Math.min(520, w * 0.46));
      Array.prototype.forEach.call(ring.children, function (fig, i) {
        fig.style.transform = 'rotateY(' + ((360 / N) * i) + 'deg) translateZ(' + radius + 'px)';
      });
    }
    layout();
    window.addEventListener('resize', layout);

    /* Penner-style eases — a linear glide reads as mechanical */
    function easeInOutCubic(t) { return t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; }

    function frame(now) {
      var dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;
      if (!dragging) {
        if (Math.abs(vel) > 0.05) {
          /* exact integral of dvel/dt = k·vel, so distance is frame-rate independent */
          var decay = Math.exp(FRICTION * dt);
          angle += vel * (1 - decay) / (-FRICTION);
          vel *= decay;
        } else if (glideTarget !== null) {
          var diff = glideTarget - angle;
          if (Math.abs(diff) < 0.06) {
            angle = glideTarget; glideTarget = null; idleT = 0; vel = 0;
          } else {
            angle += diff * (1 - Math.pow(0.002, dt));
          }
        } else {
          idleT += dt;
          if (idleT > AUTO_DELAY && !REDUCED.matches) {
            angle += AUTO_SPEED * easeInOutCubic(Math.min(1, (idleT - AUTO_DELAY) / 1.4)) * dt;
          }
        }
      }
      ring.style.transform = 'translateZ(-' + radius + 'px) rotateX(-8deg) rotateY(' + angle + 'deg)';
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    function stopAuto() { idleT = 0; glideTarget = null; vel = 0; }

    var DRAG_SCALE = 0.35;    // degrees per pixel while dragging
    var MAX_FLING = 140;      // degrees/second — a firm flick moves roughly one card
    var vSamples = [];

    stage.addEventListener('pointerdown', function (ev) {
      dragging = true; stopAuto();
      startX = ev.clientX; startAngle = angle;
      lastMoveT = performance.now(); lastDX = 0;
      vSamples = [];
      stage.setPointerCapture && stage.setPointerCapture(ev.pointerId);
    });
    stage.addEventListener('pointermove', function (ev) {
      if (!dragging) return;
      var dx = ev.clientX - startX;
      angle = startAngle + dx * DRAG_SCALE;                    // 1:1 tracking
      var now = performance.now();
      var dt = Math.max(1, now - lastMoveT) / 1000;
      vSamples.push(((dx - lastDX) * DRAG_SCALE) / dt);        // deg/second sample
      if (vSamples.length > 3) vSamples.shift();               // average of last 3
      lastDX = dx; lastMoveT = now;
    });
    function endDrag() {
      if (!dragging) return;
      dragging = false; idleT = 0;
      var sum = 0;
      for (var i = 0; i < vSamples.length; i++) sum += vSamples[i];
      var v = vSamples.length ? sum / vSamples.length : 0;
      vel = Math.max(-MAX_FLING, Math.min(MAX_FLING, v));
    }
    stage.addEventListener('pointerup', endDrag);
    stage.addEventListener('pointercancel', endDrag);
    stage.addEventListener('pointerleave', endDrag);

    function nudge(d) {
      stopAuto();
      glideTarget = (Math.round(angle / (360 / N)) + d) * (360 / N);
    }
    document.getElementById('galPrev').addEventListener('click', function () { nudge(-1); });
    document.getElementById('galNext').addEventListener('click', function () { nudge(1); });
    stage.setAttribute('tabindex', '0');
    stage.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowLeft') { ev.preventDefault(); nudge(-1); }
      if (ev.key === 'ArrowRight') { ev.preventDefault(); nudge(1); }
    });
    stage.addEventListener('pointerenter', function () { stopAuto(); });
    stage.addEventListener('pointerleave', function () { idleT = 0; });
  }
})();
