/* Tiny shared form helper for Contact and Hire pages.
   p2Form(form, {onValid(data, form)}) validates required fields (tel = 10 digits, email = pattern) and handles submit/demo mode. */
window.p2Valid = function (scope) {
  var bad = null;
  Array.prototype.slice.call(scope.querySelectorAll('input[required], select[required], textarea[required]')).forEach(function (el) {
    var v = (el.value || '').trim(), ok = !!v;
    if (ok && el.type === 'tel') { var d = v.replace(/\D/g, ''); ok = d.length >= 10 && d.length <= 13; }
    if (ok && el.type === 'email') ok = /^\S+@\S+\.\S+$/.test(v);
    var f = el.closest('.field'); if (f) f.classList.toggle('has-error', !ok);
    el.setAttribute('aria-invalid', ok ? 'false' : 'true');
    if (!ok && !bad) bad = el;
  });
  if (bad) bad.focus();
  return !bad;
};
window.p2Send = function (form, type) {
  var data = { type: type, page: location.href }; new FormData(form).forEach(function (v, k) { data[k] = v; });
  var ep = window.DESUN_CONFIG && window.DESUN_CONFIG.FORM_ENDPOINT;
  if (ep) return fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(data) }).catch(function () {});
  console.info('[Desun] FORM_ENDPOINT is empty: demo mode, form not sent.', data); return new Promise(function (r) { setTimeout(r, 500); });
};
document.addEventListener('input', function (e) { var f = e.target.closest && e.target.closest('.field.has-error'); if (f && (e.target.value || '').trim()) { f.classList.remove('has-error'); e.target.setAttribute('aria-invalid', 'false'); } });
