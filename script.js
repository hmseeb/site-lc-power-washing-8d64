/* LC Power Washing — site interactions
   Vanilla JS, no dependencies. Progressive enhancement only:
   the page and the contact form work fully without this file. */
(function () {
  'use strict';

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Hidden _page field (so visitors return to this page) ---------- */
  var pageField = document.getElementById('pageField');
  if (pageField) pageField.value = window.location.href;

  /* ---------- Mobile navigation ---------- */
  var navToggle = document.getElementById('navToggle');
  var siteNav = document.getElementById('siteNav');

  function closeNav() {
    if (!siteNav || !navToggle) return;
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-label', 'Open menu');
  }

  if (navToggle && siteNav) {
    navToggle.addEventListener('click', function () {
      var open = siteNav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    });

    siteNav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A') closeNav();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeNav();
    });
  }

  /* ---------- Header shadow on scroll ---------- */
  var header = document.getElementById('siteHeader');
  if (header) {
    var onScroll = function () {
      header.classList.toggle('scrolled', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('contactForm');
  var success = document.getElementById('formSuccess');
  var errorBox = document.getElementById('formError');
  var submitBtn = document.getElementById('submitBtn');

  function showSuccess(hideForm) {
    if (!success) return;
    success.hidden = false;
    if (form && hideForm) form.hidden = true;
    success.setAttribute('tabindex', '-1');
    success.focus({ preventScroll: true });
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  /* Confirmation after a plain (non-JS) HTML submission: ?submitted=1 */
  try {
    if (new URLSearchParams(window.location.search).get('submitted') === '1') {
      showSuccess(false);
    }
  } catch (err) { /* URLSearchParams unavailable — plain form still works */ }

  function validate() {
    var ok = true;
    var firstInvalid = null;
    var required = form.querySelectorAll('[required]');

    for (var i = 0; i < required.length; i++) {
      var field = required[i];
      var value = (field.value || '').trim();
      var valid = value !== '';

      if (valid && field.type === 'email') {
        valid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }
      if (valid && field.type === 'tel') {
        valid = (value.replace(/[^0-9]/g, '').length >= 7);
      }

      if (valid) {
        field.removeAttribute('aria-invalid');
      } else {
        field.setAttribute('aria-invalid', 'true');
        ok = false;
        if (!firstInvalid) firstInvalid = field;
      }
    }

    if (!ok) {
      showError('Please check the highlighted fields — we need a name, a valid email and a phone number to send your quote.');
      if (firstInvalid) firstInvalid.focus();
    } else if (errorBox) {
      errorBox.hidden = true;
    }

    return ok;
  }

  if (form) {
    form.addEventListener('submit', function (e) {
      // Honeypot: silently drop bot submissions.
      var gotcha = form.querySelector('[name="_gotcha"]');
      if (gotcha && gotcha.value) {
        e.preventDefault();
        return;
      }

      if (!validate()) {
        e.preventDefault();
        return;
      }

      // Enhanced submission via fetch to the same endpoint as the form action.
      if (!window.fetch || !window.FormData) return; // fall back to plain POST

      e.preventDefault();

      if (pageField) pageField.value = window.location.href;

      var data = {};
      var entries = new FormData(form);
      entries.forEach(function (value, key) {
        data[key] = typeof value === 'string' ? value : String(value);
      });
      data._page = window.location.href;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (errorBox) errorBox.hidden = true;

      fetch(form.action, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) throw new Error('Request failed with status ' + res.status);
          return res.json().catch(function () { return { ok: true }; });
        })
        .then(function (result) {
          if (result && result.ok === false) throw new Error('Submission rejected');
          showSuccess(true);
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send My Request';
          }
          showError('Sorry — we could not send that just now. Please try again in a moment.');
        });
    });

    // Clear the invalid state as soon as the visitor corrects a field.
    form.addEventListener('input', function (e) {
      if (e.target.hasAttribute && e.target.hasAttribute('aria-invalid')) {
        e.target.removeAttribute('aria-invalid');
      }
    });
  }
})();
