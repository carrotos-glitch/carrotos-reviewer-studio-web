(function () {
  'use strict';
  if (window.__studioInject) return;
  window.__studioInject = true;

  var routes = [['หน้าหลัก', '/'], ['สร้างรีวิว', '/'], ['คลังเอกสาร', '/documents'], ['คลังงานของฉัน', '/works'], ['เทมเพลต', '/templates'], ['AI Tools', '/tools'], ['ปฏิทินงาน', '/calendar'], ['สถิติ', '/stats'], ['ตั้งค่า', '/account']];
  document.addEventListener('click', function (e) {
    var n = e.target && e.target.closest ? e.target.closest('.nav') : null;
    if (!n) return;
    var text = n.textContent || '';
    for (var i = 0; i < routes.length; i++) {
      if (text.indexOf(routes[i][0]) > -1) {
        if (location.pathname === routes[i][1]) return;
        e.stopImmediatePropagation();
        e.preventDefault();
        location.href = routes[i][1];
        return;
      }
    }
  }, true);

  function note(message) {
    var d = document.createElement('div');
    d.textContent = message;
    d.style.cssText = 'position:fixed;left:50%;bottom:24px;transform:translateX(-50%);background:#563a78;color:#fff;padding:10px 16px;border-radius:12px;font-size:14px;z-index:99999;max-width:90%;text-align:center';
    document.body.appendChild(d);
    setTimeout(function () { d.remove(); }, 3200);
  }

  var originalFetch = window.fetch;
  window.fetch = function (input, init) {
    var promise = originalFetch.apply(this, arguments);
    try {
      var u = typeof input === 'string' ? input : (input && input.url) || '';
      if (/\/api\/generate(\?|$)/.test(u) && init && typeof init.body === 'string') {
        var sent = init.body;
        promise.then(function (r) {
          if (!r.ok) return;
          r.clone().json().then(function (d) {
            if (!d || !d.result) return;
            var brief = {};
            try { brief = JSON.parse(sent); } catch (e) { return; }
            delete brief.photos;
            originalFetch('/api/studio/works', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ brief: brief, result: d.result }) })
              .then(function (saved) { if (saved.ok) note('บันทึกลงคลังงานของฉันแล้ว'); })
              .catch(function () {});
          }).catch(function () {});
        }).catch(function () {});
      }
    } catch (e) {}
    return promise;
  };

  var tid = new URLSearchParams(location.search).get('template');
  if (tid && location.pathname === '/') {
    originalFetch('/api/studio/templates').then(function (r) { return r.json(); }).then(function (d) {
      var t = (d.templates || []).filter(function (x) { return x.id === tid; })[0];
      if (!t) return;
      function setField(id, value) {
        var el = document.getElementById(id);
        if (!el) return;
        if (el.tagName === 'SELECT') {
          for (var i = 0; i < el.options.length; i++) {
            if (el.options[i].value === value || el.options[i].textContent.trim() === value) { el.selectedIndex = i; break; }
          }
        } else {
          el.value = value;
        }
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      }
      setField('category', t.category);
      setField('duration', t.duration);
      setField('tone', t.tone);
      setField('brief', t.brief);
      setField('audience', t.audience);
      setField('cta', t.cta);
      setField('product', '');
      var product = document.getElementById('product');
      if (product) { product.scrollIntoView({ block: 'center' }); product.focus(); }
      note('ใช้เทมเพลต "' + t.name + '" แล้ว กรอกชื่อร้านหรือสินค้าต่อได้เลย');
    }).catch(function () {});
  }
})();
