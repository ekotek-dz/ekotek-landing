(function () {
  var CFG = window.EKOTEK_CONFIG || {};
  var I18N = window.EKOTEK_I18N;
  var lang = "en";

  // ---------- language ----------
  function t(key) { return (I18N[lang] && I18N[lang][key]) || I18N.en[key] || key; }

  function pickInitialLang() {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "fr" || q === "en" || q === "ar") return q;
    try { var s = localStorage.getItem("ekotek-lang"); if (s === "fr" || s === "en" || s === "ar") return s; } catch (e) {}
    var nav = (navigator.language || "en").toLowerCase();
    if (nav.indexOf("ar") === 0) return "ar";
    return nav.indexOf("fr") === 0 ? "fr" : "en";
  }

  function applyLang(l) {
    lang = l;
    // Arabic = Algerian Darija (ar-DZ), laid out right-to-left.
    document.documentElement.lang = l === "ar" ? "ar-DZ" : l;
    document.documentElement.dir = l === "ar" ? "rtl" : "ltr";
    document.title = t(document.body.getAttribute("data-title-key") || "meta.title");
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      el.textContent = t(el.getAttribute("data-i18n"));
    });
    document.querySelectorAll("[data-lang]").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.getAttribute("data-lang") === l));
    });
    updateSupportForm();
    renderSocial();
    try { localStorage.setItem("ekotek-lang", l); } catch (e) {}
  }

  document.querySelectorAll("[data-lang]").forEach(function (b) {
    b.addEventListener("click", function () { applyLang(b.getAttribute("data-lang")); });
  });

  // ---------- social + links ----------
  var ICONS = {
    linkedin: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5zM3 9.75h4v11H3zm7 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.65 4.77 6.1v5.46h-4v-4.84c0-1.16-.02-2.64-1.6-2.64-1.62 0-1.86 1.26-1.86 2.56v4.92H10z"/></svg>',
    instagram: '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="3.8" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.2" cy="6.8" r="1.2" fill="currentColor"/></svg>',
    facebook: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M13.5 21v-7.5H16l.4-3h-2.9V8.6c0-.87.25-1.46 1.5-1.46h1.6V4.5c-.28-.04-1.22-.12-2.32-.12-2.3 0-3.88 1.4-3.88 3.98v2.14H8v3h2.4V21z"/></svg>',
    github: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2.5a9.5 9.5 0 0 0-3 18.52c.48.09.65-.2.65-.46v-1.62c-2.64.57-3.2-1.27-3.2-1.27-.43-1.1-1.06-1.39-1.06-1.39-.86-.59.07-.58.07-.58.95.07 1.45.98 1.45.98.85 1.45 2.22 1.03 2.76.79.09-.61.33-1.03.6-1.27-2.1-.24-4.32-1.05-4.32-4.7 0-1.03.37-1.88.98-2.54-.1-.24-.42-1.2.09-2.5 0 0 .8-.26 2.6.97a9 9 0 0 1 4.74 0c1.8-1.23 2.6-.97 2.6-.97.51 1.3.19 2.26.09 2.5.61.66.98 1.51.98 2.54 0 3.66-2.23 4.46-4.35 4.7.34.29.65.87.65 1.76v2.6c0 .26.17.56.66.46A9.5 9.5 0 0 0 12 2.5z"/></svg>',
    share: '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M18 16a3 3 0 0 0-2.4 1.2l-6.7-3.4a3 3 0 0 0 0-1.6l6.7-3.4A3 3 0 1 0 15 7l-6.7 3.4a3 3 0 1 0 0 3.2L15 17a3 3 0 1 0 3-1z"/></svg>'
  };

  function renderSocial() {
    document.querySelectorAll(".js-social").forEach(function (box) {
      var html = "";
      [["linkedin", CFG.LINKEDIN, "LinkedIn"], ["instagram", CFG.INSTAGRAM, "Instagram"],
       ["facebook", CFG.FACEBOOK, "Facebook"], ["github", CFG.GITHUB, "GitHub"]].forEach(function (s) {
        if (s[1]) html += '<a class="soc" href="' + s[1] + '" target="_blank" rel="noopener" aria-label="' + s[2] + '">' + ICONS[s[0]] + "</a>";
      });
      html += '<button type="button" class="soc js-share" aria-label="' + t("sup.share") + '" title="' + t("sup.share") + '">' + ICONS.share + "</button>";
      box.innerHTML = html;
    });
    document.querySelectorAll(".js-share").forEach(function (b) {
      b.addEventListener("click", function () {
        var url = location.origin + location.pathname;
        if (navigator.share) { navigator.share({ title: "EKOTEK", url: url }).catch(function () {}); return; }
        if (navigator.clipboard) navigator.clipboard.writeText(url).then(function () { b.title = t("sup.copied"); toast(t("sup.copied")); });
      });
    });
  }

  function toast(text) {
    var el = document.createElement("div"); el.className = "toast"; el.textContent = text;
    document.body.appendChild(el); setTimeout(function () { el.remove(); }, 2000);
  }

  var gh = document.querySelector(".js-github");
  if (gh) { if (CFG.GITHUB) gh.href = CFG.GITHUB + "/ekotek-vision-prototype"; else gh.remove(); }
  document.querySelectorAll(".js-year").forEach(function (y) { y.textContent = new Date().getFullYear(); });

  // ---------- support form behaviour ----------
  var supForm = document.querySelector('[data-form="support"]');
  var donateMode = false;

  // Rotating placeholder: types out a random writing idea, then erases it.
  var rot = { el: null, timer: null, last: -1 };
  var reduceMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function stopRotate() { clearTimeout(rot.timer); rot.timer = null; }
  function nextPrompt() {
    var list = t("sup.prompts"); if (!Array.isArray(list) || !list.length) return "";
    var i; do { i = Math.floor(Math.random() * list.length); } while (list.length > 1 && i === rot.last);
    rot.last = i; return list[i];
  }
  function startRotate() {
    stopRotate();
    var el = rot.el; if (!el) return;
    if (donateMode) { el.placeholder = t("sup.don.ph"); return; }
    var text = nextPrompt(), n = 0;
    if (reduceMotion) {
      el.placeholder = text;
      rot.timer = setTimeout(startRotate, 4500);
      return;
    }
    (function type() {
      if (el.value || document.activeElement === el) { el.placeholder = text; rot.timer = setTimeout(type, 800); return; }
      n++; el.placeholder = text.slice(0, n) + (n < text.length ? "|" : "");
      if (n < text.length) rot.timer = setTimeout(type, 38);
      else rot.timer = setTimeout(erase, 2600);
    })();
    function erase() {
      if (el.value || document.activeElement === el) { rot.timer = setTimeout(erase, 800); return; }
      n = Math.max(0, n - 3); el.placeholder = text.slice(0, n);
      if (n > 0) rot.timer = setTimeout(erase, 18);
      else rot.timer = setTimeout(startRotate, 250);
    }
  }

  function setDonate(on) {
    donateMode = on;
    supForm.querySelector('input[name="kind"]').value = on ? "donate" : "contact";
    supForm.querySelector(".js-donate-hint").hidden = !on;
    var email = supForm.querySelector('input[name="email"]');
    email.required = on;
    supForm.querySelector(".js-email-label").textContent = on ? t("f.email2req") + " *" : t("f.email2");
    supForm.querySelector('textarea[name="message"]').required = !on;
    startRotate();
  }

  function updateSupportForm() { if (supForm) setDonate(donateMode); }

  if (supForm) {
    rot.el = supForm.querySelector(".js-rotate");
    // Only animate while the form is on screen.
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { if (!rot.timer) startRotate(); } else stopRotate(); });
      }).observe(supForm);
    }
    document.querySelectorAll(".js-way").forEach(function (card) {
      card.addEventListener("click", function () {
        setDonate(card.getAttribute("data-kind") === "donate");
        supForm.scrollIntoView({ behavior: "smooth", block: "center" });
        setTimeout(function () {
          var target = donateMode ? supForm.querySelector('input[name="email"]') : rot.el;
          target.focus({ preventScroll: true });
        }, 450);
      });
    });
  }

  // ---------- submissions ----------
  function collect(form) {
    var data = {};
    new FormData(form).forEach(function (v, k) { data[k] = String(v).trim(); });
    data.form = form.getAttribute("data-form");
    data.lang = lang;
    data.page = location.href;
    return data;
  }

  function mailtoFallback(data) {
    var subject = data.form === "demo"
      ? "Demo request — " + (data.establishment || "")
      : "Support — " + (data.kind || "");
    var lines = Object.keys(data).filter(function (k) { return data[k] && ["website", "page", "form"].indexOf(k) < 0; })
      .map(function (k) { return k + ": " + data[k]; });
    location.href = "mailto:" + (CFG.CONTACT_EMAIL || "ekotekdz@gmail.com") +
      "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
  }

  document.querySelectorAll(".js-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var msg = form.querySelector(".form-msg");
      msg.className = "form-msg";
      if (!form.checkValidity()) {
        form.classList.add("was-validated");
        msg.textContent = t("msg.invalid"); msg.classList.add("is-err");
        var bad = form.querySelector(":invalid"); if (bad) bad.focus();
        return;
      }
      var data = collect(form);
      if (data.website) { msg.textContent = t("msg.ok"); msg.classList.add("is-ok"); return; } // bot

      if (!CFG.FORM_ENDPOINT) { msg.textContent = t("msg.mail"); msg.classList.add("is-ok"); mailtoFallback(data); return; }

      var btn = form.querySelector('button[type="submit"]');
      btn.disabled = true; msg.textContent = t("msg.sending");
      fetch(CFG.FORM_ENDPOINT, { method: "POST", mode: "no-cors", body: new URLSearchParams(data) })
        .then(function () {
          msg.textContent = t("msg.ok"); msg.classList.add("is-ok");
          form.reset(); form.classList.remove("was-validated"); if (form === supForm) setDonate(false);
        })
        .catch(function () { msg.textContent = t("msg.err"); msg.classList.add("is-err"); })
        .then(function () { btn.disabled = false; });
    });
  });

  // ---------- nav shadow on scroll ----------
  var nav = document.querySelector(".nav");
  function onScroll() { nav.classList.toggle("is-scrolled", window.scrollY > 10); }
  window.addEventListener("scroll", onScroll, { passive: true }); onScroll();

  applyLang(pickInitialLang());
})();
