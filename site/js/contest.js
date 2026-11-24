/* Winter Contest page. GSAP optional; forms, countdown, rail drag work without it. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var can = !!(gsap && ST) && !reduced; if (can) { gsap.registerPlugin(ST); root.classList.add('a-live'); }

  $$('[data-countdown]').forEach(function (el) {
    var end = new Date(el.getAttribute('data-countdown')).getTime(), u = {};
    ['d', 'h', 'm', 's'].forEach(function (k) { u[k] = $('[data-u=' + k + ']', el); });
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() { var t = Math.max(0, end - Date.now()), s = Math.floor(t / 1000); u.d.textContent = pad(Math.floor(s / 86400)); u.h.textContent = pad(Math.floor(s % 86400 / 3600)); u.m.textContent = pad(Math.floor(s % 3600 / 60)); u.s.textContent = pad(s % 60); }
    tick(); setInterval(tick, 1000);
  });
  var f = $('#wcForm');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault(); if (!window.p2Valid(f)) return;
    var b = $('button[type=submit]', f); b.disabled = true;
    window.p2Send(f, 'winter-contest-register').then(function () { f.hidden = true; var ok = $('#wcOk'); ok.hidden = false; if (can) gsap.from(ok.children, { y: 20, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1 }); });
  });
  /* draggable rail */
  var rail = $('#wcRail');
  if (rail && fine) {
    var down = false, sx = 0, sl = 0, moved = 0;
    rail.addEventListener('pointerdown', function (e) { down = true; moved = 0; sx = e.clientX; sl = rail.scrollLeft; });
    window.addEventListener('pointermove', function (e) { if (!down) return; var dx = e.clientX - sx; moved = Math.max(moved, Math.abs(dx)); if (moved > 4) rail.classList.add('is-drag'); rail.scrollLeft = sl - dx; });
    window.addEventListener('pointerup', function () { down = false; rail.classList.remove('is-drag'); });
  }
  if (!can) return;

  var hero = $('#wcHero');
  var w = $$('.wc-hero__t .w i'); gsap.set(w, { yPercent: 115, rotate: 5 });
  var tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.wc-hero__tag', { y: 20, autoAlpha: 0, duration: 0.7 }).to(w, { yPercent: 0, rotate: 0, duration: 1, stagger: 0.07 }, 0.1)
    .from(['.wc-hero__lead', '.wc-hero__cta'], { y: 28, autoAlpha: 0, duration: 0.9, stagger: 0.12 }, 0.5)
    .from('.wc-hero__chips li', { scale: 0, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.08 }, 0.8)
    .fromTo('.wc-arch', { clipPath: 'inset(100% 0 0 0 round 999px 999px 24px 24px)' }, { clipPath: 'inset(0% 0 0 0 round 999px 999px 24px 24px)', duration: 1.4 }, 0.3)
    .from('.wc-arch img', { scale: 1.6, duration: 1.8 }, 0.3)
    .from('.wc-medal', { scale: 0, rotate: -60, duration: 1, ease: 'back.out(2)' }, 1.1)
    .from('.wc-ring', { scale: 0.8, autoAlpha: 0, duration: 1.4 }, 0.6);
  gsap.to('.wc-arch', { yPercent: -6, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true } });

  /* confetti */
  var cf = $('#wcConf'), cols = ['#8EEA7B', '#ffffff', '#F2C14E', '#2CAC0F'], H = hero.offsetHeight;
  for (var i = 0; i < 30; i++) {
    var p = document.createElement('i'); p.style.left = (Math.random() * 100) + '%'; p.style.background = cols[i % cols.length]; p.style.transform = 'rotate(' + (Math.random() * 360) + 'deg)'; if (i % 3 === 0) p.style.borderRadius = '50%'; cf.appendChild(p);
    gsap.to(p, { y: H + 60, x: '+=' + (Math.random() * 120 - 60), rotation: '+=' + (360 + Math.random() * 540), duration: 6 + Math.random() * 7, ease: 'none', repeat: -1 }).progress(Math.random());
  }
  /* spotlight follows pointer */
  if (fine) {
    var tx = 72, ty = 30, cx = 72, cy = 30, run = false;
    hero.addEventListener('pointermove', function (e) { var r = hero.getBoundingClientRect(); tx = (e.clientX - r.left) / r.width * 100; ty = (e.clientY - r.top) / r.height * 100; if (!run) { run = true; requestAnimationFrame(step); } });
    function step() { cx += (tx - cx) * 0.1; cy += (ty - cy) * 0.1; hero.style.setProperty('--mx', cx + '%'); hero.style.setProperty('--my', cy + '%'); if (Math.abs(tx - cx) > 0.05 || Math.abs(ty - cy) > 0.05) requestAnimationFrame(step); else run = false; }
  }

  /* counters */
  $$('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count), o = { v: 0 };
    ST.create({ trigger: el, start: 'top 92%', once: true, onEnter: function () { gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } }); } });
  });
  /* highlight draws */
  $$('.s-hl').forEach(function (m) { if (m.closest('.wc-hero')) return; gsap.fromTo(m, { '--hl': 0 }, { '--hl': 1, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: m, start: 'top 85%' } }); });

  /* about */
  gsap.from('.wc-about__t > *', { y: 36, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.wc-about', start: 'top 75%' } });
  gsap.from('.wc-ph--a', { x: -120, rotate: -14, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.wc-about__v', start: 'top 80%' } });
  gsap.from('.wc-ph--b', { x: 120, rotate: 14, autoAlpha: 0, duration: 1.2, ease: 'expo.out', delay: 0.15, scrollTrigger: { trigger: '.wc-about__v', start: 'top 80%' } });
  gsap.from('.wc-big', { scale: 0, rotate: -12, duration: 0.9, ease: 'back.out(2)', scrollTrigger: { trigger: '.wc-about__v', start: 'top 60%' } });
  gsap.to('.wc-ph--a img', { yPercent: -8, ease: 'none', scrollTrigger: { trigger: '.wc-about__v', start: 'top bottom', end: 'bottom top', scrub: true } });

  /* speeches */
  $$('.wc-sp').forEach(function (c, i) { gsap.from(c, { y: 120, rotate: (i - 1) * 5, autoAlpha: 0, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 88%' }, clearProps: 'transform,opacity,visibility' }); });

  /* winners: 3D tilt + reveal */
  $$('.wc-w').forEach(function (c, i) {
    gsap.from(c, { y: 100, rotateX: -20, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: '.wc-shelf', start: 'top 85%' }, clearProps: 'opacity,visibility' });
    gsap.from($('.wc-w__n', c), { scale: 0, rotate: -90, duration: 0.9, ease: 'back.out(2.4)', delay: 0.4 + i * 0.1, scrollTrigger: { trigger: '.wc-shelf', start: 'top 80%' } });
    if (!fine) return;
    c.addEventListener('pointermove', function (e) { var r = c.getBoundingClientRect(), px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5; c.style.setProperty('--ry', (px * 14) + 'deg'); c.style.setProperty('--rx', (-py * 12) + 'deg'); });
    c.addEventListener('pointerleave', function () { c.style.setProperty('--ry', '0deg'); c.style.setProperty('--rx', '0deg'); });
  });
  gsap.from('.wc-win__head > *', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.wc-win', start: 'top 78%' } });

  /* glimpses rail: figures pop in, images drift with the rail scroll */
  gsap.from('.wc-gl__f', { x: 120, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.wc-gl__rail', start: 'top 85%' }, clearProps: 'transform,opacity,visibility' });
  if (rail) {
    var imgs = $$('img', rail); gsap.set(imgs, { scale: 1.12 });
    rail.addEventListener('scroll', function () { var rc = rail.getBoundingClientRect(), mid = rc.left + rc.width / 2; imgs.forEach(function (im) { var r = im.getBoundingClientRect(); gsap.set(im, { x: (r.left + r.width / 2 - mid) * -0.04 }); }); }, { passive: true });
  }

  /* recap, register, partners, cta */
  gsap.from('.wc-recap__grid > *', { y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.wc-recap', start: 'top 75%' } });
  gsap.from('.ev-cd--w > span', { rotateX: -90, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.1, scrollTrigger: { trigger: '.ev-cd--w', start: 'top 90%' } });
  gsap.from('.wc-reg__grid > *', { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.wc-reg', start: 'top 75%' } });
  gsap.from('.wc-pt', { y: 60, scale: 0.8, autoAlpha: 0, duration: 0.8, ease: 'back.out(1.6)', stagger: 0.1, scrollTrigger: { trigger: '.wc-pts__l', start: 'top 88%' }, clearProps: 'transform,opacity,visibility' });
  gsap.from('.wc-cta__in > *', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.wc-cta', start: 'top 90%' } });
})();
