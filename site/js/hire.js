/* Hire from us: hero, counters, talent pool, journey scrub, stories, partner form. GSAP optional. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var can = !!(gsap && ST) && !reduced; if (can) { gsap.registerPlugin(ST); root.classList.add('a-live'); }

  /* partner form (works without motion) */
  var form = $('#hrForm');
  if (form) form.addEventListener('submit', function (e) {
    e.preventDefault(); if (!window.p2Valid(form)) return;
    var b = $('button[type=submit]', form); b.disabled = true; b.textContent = 'Sending…';
    window.p2Send(form, 'hire-partner').then(function () { form.hidden = true; var ok = $('#hrOk'); ok.hidden = false; if (can) gsap.from(ok.children, { y: 24, autoAlpha: 0, duration: 0.7, ease: 'expo.out', stagger: 0.1 }); });
  });
  /* talent pool: click/tap opens on desktop (keyboard focus also opens via CSS) */
  var pcs = $$('.hr-pc');
  pcs.forEach(function (c) { c.addEventListener('click', function () { pcs.forEach(function (x) { x.classList.toggle('is-open', x === c); }); }); });
  /* journey: no motion fallback shows all steps filled */
  var steps = $$('.hr-st'), track = $('.hr-track');
  if (!can) { if (track) track.style.setProperty('--fill', 1); steps.forEach(function (s) { s.classList.add('is-on'); }); return; }

  var w = $$('.hr-hero__t .w i, .hr-hero__h .w i'); gsap.set(w, { yPercent: 115, rotate: 4 }); gsap.to(w, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.05, delay: 0.1 });
  gsap.from(['.hr-hero .c-kicker', '.hr-hero__p', '.hr-hero__cta'], { y: 28, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.3 });
  gsap.from('.hr-hero__tags li', { scale: 0, autoAlpha: 0, duration: 0.8, ease: 'back.out(2)', stagger: 0.08, delay: 0.8 });
  gsap.to('.hr-hero__bg img', { yPercent: 14, scale: 1.08, ease: 'none', scrollTrigger: { trigger: '.hr-hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.from('.hr-stats__card', { y: 80, autoAlpha: 0, duration: 1, ease: 'expo.out', delay: 0.5 });

  /* counters */
  $$('[data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count), dec = parseInt(el.dataset.dec || '0', 10), o = { v: 0 };
    ST.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () { gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: function () { el.textContent = o.v.toFixed(dec); } }); } });
  });
  gsap.from('.hr-stats__list li', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, delay: 0.8 });
  gsap.from('.hr-pc', { y: 70, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.hr-pcs', start: 'top 85%' }, clearProps: 'transform,opacity,visibility' });
  gsap.from('.hr-pool .container > *:not(.hr-pcs)', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.hr-pool', start: 'top 75%' } });

  /* journey: line fills, token travels, steps light up in order */
  var desktop = window.matchMedia('(min-width: 1024px)');
  gsap.fromTo(track, { '--fill': 0 }, { '--fill': 1, ease: 'none', scrollTrigger: { trigger: track, start: desktop.matches ? 'top 75%' : 'top 70%', end: desktop.matches ? 'bottom 55%' : 'bottom 60%', scrub: 0.4 } });
  steps.forEach(function (s, i) { ST.create({ trigger: s, start: desktop.matches ? 'top 72%' : 'top 68%', end: function () { return ST.maxScroll(window) + 5; }, toggleClass: { targets: s, className: 'is-on' } }); });
  gsap.from('.hr-st', { y: 40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.hr-track', start: 'top 85%' }, clearProps: 'transform,opacity,visibility' });
  gsap.from('.hr-journey .h2', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', scrollTrigger: { trigger: '.hr-journey', start: 'top 80%' } });

  gsap.from('.hr-quote__f > *', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.hr-quote', start: 'top 70%' } });
  gsap.from('.hr-quote__img', { x: 100, rotate: 8, autoAlpha: 0, duration: 1.2, ease: 'expo.out', scrollTrigger: { trigger: '.hr-quote', start: 'top 70%' } });
  gsap.fromTo('.hr-quote__img img', { yPercent: -8 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '.hr-quote', start: 'top bottom', end: 'bottom top', scrub: true } });
  gsap.from('.hr-sc', { y: 120, rotate: function (i) { return (i % 2 ? 1 : -1) * 6; }, autoAlpha: 0, duration: 1, ease: 'expo.out', stagger: 0.12, scrollTrigger: { trigger: '.hr-scs', start: 'top 88%' }, clearProps: 'transform,opacity,visibility' });
  gsap.from('.hr-form__copy > *', { y: 36, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.hr-form', start: 'top 75%' } });
  gsap.from('.hr-form__card', { y: 70, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: '.hr-form', start: 'top 75%' }, clearProps: 'transform,opacity,visibility' });
})();
