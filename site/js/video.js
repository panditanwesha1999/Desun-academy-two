/* Shared video lightbox. Any element with data-video="<url>" opens it.
   Supports YouTube (watch / youtu.be / shorts), Instagram reel/post, and direct .mp4/.webm files.
   Empty data-video shows a "video coming soon" state, so the layout can ship before the links are ready. */
(function () {
  'use strict';
  var dlg = document.createElement('dialog');
  dlg.className = 'vmodal'; dlg.setAttribute('aria-label', 'Video player');
  dlg.innerHTML = '<div class="vmodal__inner"><button class="vmodal__close" type="button" aria-label="Close video"><svg class="icon icon--24" aria-hidden="true"><use href="#i-x"/></svg></button><p class="vmodal__title"></p><div class="vmodal__stage"></div></div>';
  document.body.appendChild(dlg);
  var stage = dlg.querySelector('.vmodal__stage'), ttl = dlg.querySelector('.vmodal__title'), last = null;
  function embed(url) {
    var m;
    if ((m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|shorts\/|embed\/))([\w-]{6,})/))) return { t: 'frame', src: 'https://www.youtube.com/embed/' + m[1] + '?autoplay=1&rel=0', v: /shorts/.test(url) };
    if ((m = url.match(/instagram\.com\/(reel|p)\/([\w-]+)/))) return { t: 'frame', src: 'https://www.instagram.com/' + m[1] + '/' + m[2] + '/embed', v: true };
    if (/\.(mp4|webm|ogg)(\?|$)/i.test(url)) return { t: 'video', src: url, v: false };
    return null;
  }
  function open(url, title, v) {
    stage.innerHTML = ''; ttl.textContent = title || ''; dlg.classList.remove('is-vertical');
    var e = url ? embed(url) : null;
    if (e) {
      dlg.classList.toggle('is-vertical', !!e.v);
      var el = e.t === 'video' ? document.createElement('video') : document.createElement('iframe');
      if (e.t === 'video') { el.controls = true; el.autoplay = true; el.playsInline = true; el.src = e.src; }
      else { el.src = e.src; el.allow = 'autoplay; encrypted-media; picture-in-picture'; el.allowFullscreen = true; el.title = title || 'Video'; }
      stage.appendChild(el);
    } else if (url) { window.open(url, '_blank', 'noopener'); return; }
    else { stage.innerHTML = '<div class="vmodal__empty"><svg class="icon icon--32" aria-hidden="true"><use href="#i-play"/></svg><p>This video will play here.</p><small>Add its link to the <code>data-video</code> attribute.</small></div>'; }
    if (v) dlg.classList.add('is-vertical');
    if (typeof dlg.showModal === 'function') dlg.showModal(); else dlg.setAttribute('open', '');
  }
  function close() { stage.innerHTML = ''; if (dlg.open) dlg.close(); if (last) { try { last.focus(); } catch (e) {} } }
  document.addEventListener('click', function (ev) {
    var t = ev.target.closest('[data-video]'); if (!t) return;
    ev.preventDefault(); last = t; open(t.getAttribute('data-video'), t.getAttribute('data-title'), t.hasAttribute('data-vertical'));
  });
  dlg.querySelector('.vmodal__close').addEventListener('click', close);
  dlg.addEventListener('click', function (ev) { if (ev.target === dlg) close(); });
  dlg.addEventListener('close', function () { stage.innerHTML = ''; });
})();
