/* Associate Partner page. Calculator, tabs, FAQ, forms work without GSAP; GSAP adds the motion. */
(function () {
  'use strict';
  var gsap = window.gsap, ST = window.ScrollTrigger, root = document.documentElement;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var can = !!(gsap && ST) && !reduced; if (can) { gsap.registerPlugin(ST); root.classList.add('a-live'); }

  /* Indian digit grouping: 225000 -> 2,25,000 */
  function inr(n) { n = Math.round(n); var s = String(Math.abs(n)), last = s.slice(-3), rest = s.slice(0, -3); if (rest) rest = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ','), last = rest + ',' + last; return (n < 0 ? '-' : '') + last; }

  /* rings: static value always, animated when live */
  $$('.pt-ring__v').forEach(function (r) { r.style.setProperty('--p', r.getAttribute('data-pct') * 4); });

  /* calculator */
  var calc = $('#ptCalc');
  if (calc) {
    var adm = $('#rAdm'), fee = $('#rFee'), cr = $('#rCrash'), shown = { v: 0 };
    function val() {
      var rate = parseFloat($('input[name=tier]:checked', calc).value), a = +adm.value, f = +fee.value, c = +cr.value;
      var p = a * f * rate, k = c * 20000 * 0.25, t = p + k;
      $('#oAdm').textContent = a; $('#oFee').textContent = '₹' + inr(f); $('#oCrash').textContent = c;
      $('#cP').textContent = '₹' + inr(p); $('#cC').textContent = '₹' + inr(k); $('#cY').textContent = '₹' + inr(t * 12);
      $('#cBarP').style.width = (t ? p / t * 100 : 0) + '%'; $('#cBarC').style.width = (t ? k / t * 100 : 0) + '%';
      var out = $('#cOut');
      if (can) gsap.to(shown, { v: t, duration: 0.6, ease: 'power3.out', overwrite: true, onUpdate: function () { out.textContent = inr(shown.v); } });
      else out.textContent = inr(t);
      if (!can) shown.v = t;
    }
    calc.addEventListener('input', val); calc.addEventListener('change', val);
    $$('.pt-pre button', calc).forEach(function (b) {
      b.addEventListener('click', function () {
        var p = b.getAttribute('data-p').split(',');
        $$('input[name=tier]', calc)[+p[0]].checked = true; adm.value = p[1]; fee.value = p[2]; cr.value = p[3]; val();
      });
    });
    val();
  }

  /* tabs (who should join) */
  var tabs = $$('.pt-tab'), pill = $('.pt-tabs__pill');
  function movePill(animate) {
    var on = $('.pt-tab.is-on'); if (!pill || !on) return;
    var x = on.offsetLeft, w = on.offsetWidth, y = on.offsetTop;
    if (can && animate) gsap.to(pill, { x: x, y: y - 6, width: w, duration: 0.5, ease: 'expo.out' }); else gsap.set ? (window.gsap ? gsap.set(pill, { x: x, y: y - 6, width: w }) : 0) : 0;
  }
  function pick(i, focus) {
    tabs.forEach(function (t, j) {
      var on = i === j; t.classList.toggle('is-on', on); t.setAttribute('aria-selected', on); t.tabIndex = on ? 0 : -1;
      var p = $('#' + t.getAttribute('aria-controls')); if (p) p.hidden = !on;
      if (on && p && can) gsap.from(p.children, { y: 24, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.08, clearProps: 'transform,opacity,visibility' });
    });
    if (focus) tabs[i].focus(); movePill(true);
  }
  tabs.forEach(function (t, i) {
    t.addEventListener('click', function () { pick(i); });
    t.addEventListener('keydown', function (e) { var k = e.key; if (k === 'ArrowRight' || k === 'ArrowDown') { e.preventDefault(); pick((i + 1) % tabs.length, true); } else if (k === 'ArrowLeft' || k === 'ArrowUp') { e.preventDefault(); pick((i - 1 + tabs.length) % tabs.length, true); } });
  });
  window.addEventListener('resize', function () { movePill(false); });

  /* FAQ accordion (one open at a time) */
  $$('.pt-q__b').forEach(function (b) {
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      $$('.pt-q__b').forEach(function (o) { o.setAttribute('aria-expanded', 'false'); o.closest('.pt-q').classList.remove('is-open'); var a = $('#' + o.getAttribute('aria-controls')); if (a && !a.hidden) { if (can) gsap.to(a, { height: 0, duration: 0.3, ease: 'power2.inOut', onComplete: function () { a.hidden = true; gsap.set(a, { clearProps: 'height' }); } }); else a.hidden = true; } });
      if (!open) { b.setAttribute('aria-expanded', 'true'); b.closest('.pt-q').classList.add('is-open'); var a = $('#' + b.getAttribute('aria-controls')); gsap && can ? (a.hidden = false, gsap.from(a, { height: 0, duration: 0.4, ease: 'power2.out', clearProps: 'height' })) : (a.hidden = false); }
    });
  });

  /* tier buttons preselect the application form */
  $$('[data-tier]').forEach(function (b) {
    b.addEventListener('click', function () {
      var s = $('#ptTier'); if (s) { s.value = b.getAttribute('data-tier'); s.dispatchEvent(new Event('change', { bubbles: true })); }
      var t = $('#apply'); if (t) t.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); setTimeout(function () { var n = $('#ptName'); if (n) n.focus({ preventScroll: true }); }, reduced ? 0 : 700);
    });
  });

  /* forms */
  function wire(id, okId, type, msgSel) {
    var f = $(id); if (!f) return;
    f.addEventListener('submit', function (e) {
      e.preventDefault(); if (!window.p2Valid(f)) return;
      var b = $('button[type=submit]', f); b.disabled = true;
      window.p2Send(f, type).then(function () { f.hidden = true; var ok = $(okId); ok.hidden = false; if (can) gsap.from(ok.children, { y: 20, autoAlpha: 0, duration: 0.6, ease: 'expo.out', stagger: 0.1 }); });
    });
  }
  wire('#ptHero', '#ptqOk', 'partner-quick'); wire('#ptForm', '#ptOk', 'partner-application');
  /* hide the card header text once the quick form is done */
  var hf = $('#ptHero'); if (hf) hf.addEventListener('submit', function () { var h = $('.pt-quick__h', hf.parentNode), p = $('.pt-quick__p', hf.parentNode); setTimeout(function () { if (hf.hidden) { h.hidden = p.hidden = true; } }, 600); });

  if (!can) { $$('[data-count]').forEach(function (el) { el.textContent = Number(el.getAttribute('data-count')).toLocaleString('en-IN'); }); movePill(false); return; }

  var mm = gsap.matchMedia();
  /* hero */
  var w = $$('.pt-hero__t .w i'); gsap.set(w, { yPercent: 115, rotate: 5 }); gsap.to(w, { yPercent: 0, rotate: 0, duration: 1, ease: 'expo.out', stagger: 0.08, delay: 0.1 });
  gsap.from(['.pt-hero__badge', '.pt-hero__lead', '.pt-hero__cta', '.pt-hero__tk li', '.pt-hero__rec li'], { y: 24, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.07, delay: 0.3 });
  gsap.from('.pt-quick', { y: 60, rotate: 2, autoAlpha: 0, duration: 1.1, ease: 'expo.out', delay: 0.35, clearProps: 'transform,opacity,visibility' });
  gsap.from('.pt-chip', { scale: 0, autoAlpha: 0, duration: 0.7, ease: 'back.out(2)', stagger: 0.15, delay: 0.9 });
  gsap.to('.pt-hero__grid-bg', { yPercent: 12, ease: 'none', scrollTrigger: { trigger: '.pt-hero', start: 'top top', end: 'bottom top', scrub: true } });
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (fine) { var hr = $('.pt-hero'), chips = $$('.pt-chip'); hr.addEventListener('pointermove', function (e) { var r = hr.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; chips.forEach(function (c, i) { gsap.to(c, { x: x * (30 + i * 14), duration: 0.8, ease: 'power3.out', overwrite: 'auto' }); }); }); }

  /* counters */
  $$('[data-count]').forEach(function (el) {
    var end = +el.getAttribute('data-count'), o = { v: 0 }; el.textContent = '0';
    ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: function () { gsap.to(o, { v: end, duration: 1.6, ease: 'power3.out', onUpdate: function () { el.textContent = Math.round(o.v).toLocaleString('en-IN'); } }); } });
  });

  /* generic reveals */
  function rv(sel, trig, vars) { var els = $$(sel); if (!els.length) return; gsap.from(els, Object.assign({ y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: trig || els[0], start: 'top 85%', once: true } }, vars || {})); }
  $$('.pt-h2').forEach(function (h) { gsap.from(h, { y: 30, autoAlpha: 0, duration: 0.9, ease: 'expo.out', clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: h, start: 'top 88%', once: true } }); });
  rv('.pt-fc', '.pt-stack'); rv('.pt-about blockquote'); rv('.pt-about__f', null, { scale: 0.94, y: 60 });
  rv('.pt-seg:not([hidden]) > div', '.pt-segs');
  rv('.pt-sc', '.pt-scs'); rv('.pt-net > div', '.pt-net'); rv('.pt-cm', '.pt-comm__c'); rv('.pt-aw', '.pt-aws', { x: 30, y: 0 });
  rv('.pt-box', '.pt-elig__g'); rv('.pt-q', '.pt-faq__l', { stagger: 0.07 }); rv('.pt-kh li', '.pt-kh', { scale: 0.9 });
  gsap.from('.pt-cta__in > *', { y: 40, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.1, clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.pt-cta', start: 'top 75%', once: true } });

  /* products: cards slide in from opposite sides, coin travels along the funnel */
  mm.add('(min-width: 1024px)', function () {
    gsap.from('.pt-pd--1', { x: -80, autoAlpha: 0, duration: 1, ease: 'expo.out', clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.pt-funnel', start: 'top 80%', once: true } });
    gsap.from('.pt-pd--2', { x: 80, autoAlpha: 0, duration: 1, ease: 'expo.out', delay: 0.15, clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.pt-funnel', start: 'top 80%', once: true } });
    gsap.fromTo('.pt-flow__coin', { x: -60 }, { x: 60, ease: 'none', scrollTrigger: { trigger: '.pt-funnel', start: 'top 70%', end: 'bottom 50%', scrub: 0.6 } });
  });
  mm.add('(max-width: 1023px)', function () {
    gsap.from('.pt-pd', { y: 50, autoAlpha: 0, duration: 0.9, ease: 'expo.out', stagger: 0.15, clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.pt-funnel', start: 'top 85%', once: true } });
    gsap.fromTo('.pt-flow__coin', { y: -30 }, { y: 30, ease: 'none', scrollTrigger: { trigger: '.pt-flow', start: 'top 90%', end: 'bottom 40%', scrub: 0.6 } });
  });

  /* tiers: ring sweeps in */
  $$('.pt-tier').forEach(function (t, i) {
    var r = $('.pt-ring__v', t), target = r.getAttribute('data-pct') * 4;
    gsap.fromTo(r, { '--p': 0 }, { '--p': target, duration: 1.6, ease: 'expo.out', scrollTrigger: { trigger: t, start: 'top 80%', once: true } });
    gsap.from(t, { y: 60, autoAlpha: 0, duration: 1, ease: 'expo.out', delay: i * 0.12, clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.pt-tiers__g', start: 'top 85%', once: true } });
  });

  /* steps: line fills with scroll, each node lights up when passed */
  var list = $('.pt-steps__l'), sts = $$('.pt-st');
  if (list) {
    gsap.set(list, { '--fill': 0 });
    gsap.to(list, { '--fill': 1, ease: 'none', scrollTrigger: { trigger: list, start: 'top 60%', end: 'bottom 60%', scrub: 0.4 } });
    sts.forEach(function (s) {
      ScrollTrigger.create({ trigger: s, start: 'top 60%', onEnter: function () { s.classList.add('is-on'); }, onLeaveBack: function () { s.classList.remove('is-on'); } });
      gsap.from($('.pt-st__c', s), { x: 40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: s, start: 'top 85%', once: true } });
    });
  }

  /* vision bars grow */
  $$('.pt-v').forEach(function (v, i) {
    var bar = $('.pt-v__bar i', v); gsap.from(bar, { scaleX: 0, duration: 1.4, ease: 'expo.out', delay: i * 0.1, scrollTrigger: { trigger: v, start: 'top 85%', once: true } });
    gsap.from(v, { y: 40, autoAlpha: 0, duration: 0.8, ease: 'expo.out', delay: i * 0.1, clearProps: 'transform,opacity,visibility', scrollTrigger: { trigger: '.pt-vl', start: 'top 85%', once: true } });
  });

  /* image parallax */
  $$('.pt-about__f img, .pt-apply__f img').forEach(function (img) { gsap.fromTo(img, { yPercent: -8, scale: 1.12 }, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: img.parentNode, start: 'top bottom', end: 'bottom top', scrub: true } }); });

  setTimeout(function () { movePill(false); ST.refresh(); }, 300);
  window.addEventListener('load', function () { movePill(false); ST.refresh(); });
})();
