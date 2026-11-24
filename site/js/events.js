/* Events page: countdown, notify form, hero + pinned horizontal "reel" of past events. GSAP optional. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var can = !!(gsap && ST) && !reduced; if (can) { gsap.registerPlugin(ST); root.classList.add('a-live'); }

  /* countdowns (work without GSAP) */
  $$('[data-countdown]').forEach(function (el) {
    var end = new Date(el.getAttribute('data-countdown')).getTime(), u = {};
    ['d', 'h', 'm', 's'].forEach(function (k) { u[k] = $('[data-u=' + k + ']', el); });
    function pad(n) { return (n < 10 ? '0' : '') + n; }
    function tick() { var t = Math.max(0, end - Date.now()), s = Math.floor(t / 1000); u.d.textContent = pad(Math.floor(s / 86400)); u.h.textContent = pad(Math.floor(s % 86400 / 3600)); u.m.textContent = pad(Math.floor(s % 3600 / 60)); u.s.textContent = pad(s % 60); }
    tick(); setInterval(tick, 1000);
  });

  /* subscribe form */
  var f = $('#evForm');
  if (f) f.addEventListener('submit', function (e) {
    e.preventDefault(); if (!window.p2Valid(f)) return;
    var b = $('button[type=submit]', f); b.disabled = true;
    window.p2Send(f, 'event-subscribe').then(function () { f.hidden = true; var ok = $('#evOk'); ok.hidden = false; if (can) gsap.from(ok.children, { y: 20, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1 }); });
  });
  if (!can) return;

  /* hero */
  var w = $$('.ev-hero__t .w i'); gsap.set(w, { yPercent: 115, rotate: 5 }); gsap.to(w, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.1 });
  gsap.from(['.ev-hero .c-kicker', '.ev-hero__lead', '.ev-hero__cta'], { y: 28, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.12, delay: 0.3 });
  gsap.from('.ev-tk', { y: -160, rotate: function (i) { return i ? 14 : -14; }, autoAlpha: 0, duration: 1.3, ease: 'bounce.out', stagger: 0.25, delay: 0.5, clearProps: 'transform,opacity,visibility' });
  gsap.to('.ev-hero__yr', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.ev-hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.ev-orb--1', { x: 80, y: 60, duration: 7, ease: 'sine.inOut', yoyo: true, repeat: -1 }); gsap.to('.ev-orb--2', { x: -90, y: -40, duration: 9, ease: 'sine.inOut', yoyo: true, repeat: -1 });

  /* next up */
  $$('.ev-ft').forEach(function (c, i) {
    gsap.from(c, { y: 90, autoAlpha: 0, duration: 1, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 85%' }, clearProps: 'transform,opacity,visibility' });
    gsap.fromTo($('.ev-ft__img img', c), { scale: 1.3 }, { scale: 1, ease: 'none', scrollTrigger: { trigger: c, start: 'top bottom', end: 'bottom top', scrub: true } });
    gsap.from($('.ev-ft__stamp', c), { scale: 3, rotate: -30, autoAlpha: 0, duration: 0.6, ease: 'back.out(2)', delay: 0.4, scrollTrigger: { trigger: c, start: 'top 75%' } });
  });
  gsap.from('.ev-next .c-kicker, .ev-next .h2', { y: 30, autoAlpha: 0, duration: 0.8, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: '.ev-next', start: 'top 80%' } });

  /* counters */
  $$('.ev-reel [data-count]').forEach(function (el) {
    var end = parseFloat(el.dataset.count), o = { v: 0 };
    ST.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () { gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v); } }); } });
  });

  var mm = gsap.matchMedia();
  mm.add('(min-width: 1024px)', function () {
    var track = $('#evTrack'), pin = $('.ev-reel__pin'), cards = $$('.ev-pc'), mon = $('#evMon'), bar = $('#evBar'), cur = '';
    function dist() { return Math.max(0, track.scrollWidth - window.innerWidth); }
    var tween = gsap.to(track, { x: function () { return -dist(); }, ease: 'none', scrollTrigger: { trigger: pin, pin: true, start: 'top top', end: function () { return '+=' + dist(); }, scrub: 0.6, invalidateOnRefresh: true, anticipatePin: 1,
      onUpdate: function (self) {
        gsap.set(bar, { scaleX: self.progress });
        var mid = window.innerWidth * 0.55, best = null, bd = 1e9;
        cards.forEach(function (c) { var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - mid); if (d < bd) { bd = d; best = c; } });
        var m = best ? best.getAttribute('data-month').toUpperCase() : '';
        if (m && m !== cur) { cur = m; gsap.fromTo(mon, { yPercent: 25, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.5, ease: 'expo.out', onStart: function () { mon.textContent = m; } }); }
      } } });
    cards.forEach(function (c) {
      var img = $('img', c); gsap.set(img, { scale: 1.3 });
      gsap.fromTo(img, { xPercent: -9 }, { xPercent: 9, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left right', end: 'right left', scrub: true } });
      gsap.from(c, { rotate: 6, scale: 0.9, ease: 'none', scrollTrigger: { trigger: c, containerAnimation: tween, start: 'left 105%', end: 'left 70%', scrub: true } });
    });
    gsap.from('.ev-reel__intro > *', { x: -40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, scrollTrigger: { trigger: pin, start: 'top 70%' } });
  });
  mm.add('(max-width: 1023px)', function () {
    $$('.ev-pc').forEach(function (c) { gsap.from(c, { y: 70, rotate: 2, autoAlpha: 0, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: c, start: 'top 90%' }, clearProps: 'transform,opacity,visibility' }); });
  });

  gsap.from('.ev-places__c li', { y: 40, scale: 0.7, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.07, scrollTrigger: { trigger: '.ev-places__c', start: 'top 88%' } });
  gsap.from('.ev-join__grid > *', { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.15, scrollTrigger: { trigger: '.ev-join', start: 'top 75%' } });
})();
