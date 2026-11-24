/* Coverflow-style tilt for a native scroll-snap row. Works with touch, mouse, keyboard and without GSAP. */
window.coverflow = function (row, onChange) {
  'use strict';
  var kids = Array.prototype.slice.call(row.children), cur = -1, ticking = false;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function paint() {
    ticking = false;
    var rc = row.getBoundingClientRect(), mid = rc.left + rc.width / 2, best = 0, bd = 1e9;
    kids.forEach(function (k, i) {
      var r = k.getBoundingClientRect(), d = (r.left + r.width / 2 - mid) / r.width, ad = Math.min(Math.abs(d), 1.4);
      if (Math.abs(d) < bd) { bd = Math.abs(d); best = i; }
      if (!reduce) { k.style.transform = 'perspective(900px) rotateY(' + (-d * 26).toFixed(1) + 'deg) scale(' + (1 - ad * 0.1).toFixed(3) + ')'; k.style.opacity = (1 - Math.min(ad, 1) * 0.45).toFixed(2); }
      k.classList.toggle('is-center', i === best);
    });
    kids.forEach(function (k, i) { k.classList.toggle('is-center', i === best); });
    if (best !== cur) { cur = best; if (onChange) onChange(best); }
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }
  row.addEventListener('scroll', req, { passive: true }); window.addEventListener('resize', req); paint();
  return { go: function (i) { var k = kids[Math.max(0, Math.min(kids.length - 1, i))]; row.scrollTo({ left: k.offsetLeft - (row.clientWidth - k.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' }); }, index: function () { return cur; } };
};
