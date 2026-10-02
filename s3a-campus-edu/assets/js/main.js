/* S3A Campus EDU — site interactions */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
   * CONFIG — edit before going live
   * formEndpoint: any service that accepts a JSON/form POST, e.g.
   *   Formspree  -> "https://formspree.io/f/xxxxxxx"
   *   Web3Forms  -> "https://api.web3forms.com/submit" (add accessKey)
   *   Google Apps Script web app URL (writes leads to a Google Sheet)
   * If left empty, leads are sent to WhatsApp as a prefilled message.
   * ------------------------------------------------------------------ */
  var CONFIG = {
    formEndpoint: '',
    web3formsAccessKey: '',
    whatsappNumber: '919999999999',
    popupDelayMs: 25000
  };

  var $ = function (s, ctx) { return (ctx || document).querySelector(s); };
  var $$ = function (s, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(s)); };

  $('#year').textContent = new Date().getFullYear();

  /* ---------- Header + back-to-top on scroll ---------- */
  var header = $('#header');
  var toTop = $('#toTop');
  function onScroll() {
    var y = window.scrollY;
    header.classList.toggle('scrolled', y > 10);
    toTop.classList.toggle('show', y > 700);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
  toTop.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });

  /* ---------- Mobile nav ---------- */
  var nav = $('#nav');
  var navToggle = $('#navToggle');
  function setNav(open) {
    if (open) nav.style.setProperty('--nav-top', header.getBoundingClientRect().bottom + 'px');
    nav.classList.toggle('open', open);
    navToggle.setAttribute('aria-expanded', String(open));
    navToggle.querySelector('use').setAttribute('href', open ? '#i-x' : '#i-menu');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  navToggle.addEventListener('click', function () { setNav(!nav.classList.contains('open')); });
  $$('a', nav).forEach(function (a) { a.addEventListener('click', function () { setNav(false); }); });

  /* ---------- Scroll spy ---------- */
  var links = $$('.nav__link');
  var sections = links.map(function (l) { return $(l.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var siblings = $$('.reveal', e.target.parentElement);
        var idx = Math.max(0, siblings.indexOf(e.target));
        e.target.style.transitionDelay = Math.min(idx * 60, 400) + 'ms';
        e.target.classList.add('in');
        ro.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (el) { ro.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- Counters ---------- */
  function animateCount(el) {
    var target = parseFloat(el.dataset.count);
    var decimals = parseInt(el.dataset.decimals || '0', 10);
    var suffix = el.dataset.suffix || '';
    var start = null, dur = 1800;
    function fmt(n) {
      return n.toLocaleString('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix;
    }
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = $$('[data-count]');
  if ('IntersectionObserver' in window) {
    var co = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { co.observe(c); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Role tabs ---------- */
  var tabs = $$('.tab');
  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); t.setAttribute('aria-selected', 'false'); });
      $$('.tabpanel').forEach(function (p) { p.classList.remove('active'); });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      $('#tab-' + tab.dataset.tab).classList.add('active');
    });
  });

  /* ---------- Plan buttons prefill the lead form ---------- */
  var leadForm = $('#leadForm');
  $$('[data-plan]').forEach(function (b) {
    b.addEventListener('click', function () { leadForm.elements.plan.value = b.dataset.plan; });
  });

  /* ---------- Demo popup (once per session) ---------- */
  var modal = $('#demoModal');
  var popupShown = false;
  function storageGet(k) { try { return sessionStorage.getItem(k); } catch (e) { return null; } }
  function storageSet(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  function openModal() {
    if (popupShown || storageGet('s3a_popup') || storageGet('s3a_lead')) return;
    popupShown = true;
    storageSet('s3a_popup', '1');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    setTimeout(function () { var f = $('input[name="name"]', modal); if (f) f.focus(); }, 300);
  }
  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
  }
  $$('[data-close]', modal).forEach(function (el) { el.addEventListener('click', closeModal); });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') closeModal(); });
  setTimeout(openModal, CONFIG.popupDelayMs);
  document.addEventListener('mouseout', function (e) {
    if (!e.relatedTarget && e.clientY <= 0) openModal(); // exit intent (desktop)
  });

  /* ---------- Lead forms ---------- */
  function validate(form) {
    var ok = true;
    $$('input[required]', form).forEach(function (input) {
      var valid = input.value.trim() !== '' && input.checkValidity();
      if (input.type === 'tel') valid = valid && input.value.replace(/\D/g, '').length >= 10;
      input.classList.toggle('invalid', !valid);
      if (!valid && ok) { input.focus(); ok = false; }
    });
    return ok;
  }

  function collect(form) {
    var data = {};
    $$('input, select', form).forEach(function (el) {
      if (el.name && el.name !== '_gotcha' && el.value) data[el.name] = el.value.trim();
    });
    data.source = form.id === 'quickForm' ? 'Popup' : 'Contact form';
    data.page = location.href;
    return data;
  }

  function toWhatsApp(data) {
    var lines = ['*New Demo Request — S3A Campus EDU*'];
    var labels = { name: 'Name', phone: 'Mobile', institution: 'Institution', email: 'Email', city: 'City', role: 'Role', students: 'Students', plan: 'Plan' };
    Object.keys(labels).forEach(function (k) { if (data[k]) lines.push(labels[k] + ': ' + data[k]); });
    window.open('https://wa.me/' + CONFIG.whatsappNumber + '?text=' + encodeURIComponent(lines.join('\n')), '_blank', 'noopener');
  }

  function submitLead(form) {
    var status = $('.form-status', form);
    var btn = $('button[type="submit"]', form);
    form.addEventListener('input', function (e) { e.target.classList.remove('invalid'); });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      status.className = 'form-status';
      status.textContent = '';
      if (form.elements._gotcha && form.elements._gotcha.value) return; // bot
      if (!validate(form)) {
        status.classList.add('err');
        status.textContent = 'Please fill in the required fields.';
        return;
      }
      var data = collect(form);

      function done() {
        storageSet('s3a_lead', '1');
        form.reset();
        status.classList.add('ok');
        status.textContent = '✅ Thank you! Our team will call you within 24 hours.';
        btn.disabled = false;
        if (form.id === 'quickForm') setTimeout(closeModal, 2500);
      }

      if (!CONFIG.formEndpoint) {
        toWhatsApp(data);
        done();
        return;
      }

      btn.disabled = true;
      if (CONFIG.web3formsAccessKey) data.access_key = CONFIG.web3formsAccessKey;
      data.subject = 'New demo request: ' + (data.institution || '');
      fetch(CONFIG.formEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(data)
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        done();
      }).catch(function () {
        btn.disabled = false;
        status.classList.add('err');
        status.textContent = 'Something went wrong. Opening WhatsApp instead…';
        toWhatsApp(data);
      });
    });
  }

  submitLead(leadForm);
  submitLead($('#quickForm'));
})();
