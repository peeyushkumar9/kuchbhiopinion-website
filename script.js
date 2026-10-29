// Kuch Bhi Opinion — behaviour (vanilla JS, no libraries)
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initTheme();
  initLogoTop();
  initTabSpy();
  initPaging();
  initLightbox();
  initShortDialog();
  initCopyLink();
  initWords();
  initMenu();

  // The logo takes you to the very top of the page, with the BREAKING strip
  // showing. On the home page that is a scroll; on other pages the link loads
  // the home page, which opens at the top.
  function initLogoTop() {
    var logo = document.querySelector(".nav .brand");
    if (!logo || !document.getElementById("top")) return;
    logo.addEventListener("click", function (e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: reduceMotion ? "auto" : "smooth" });
      if (window.history && history.replaceState) history.replaceState(null, "", window.location.pathname + window.location.search);
    });
  }

  // Day / Night switch. The theme itself is set before first paint (inline script in
  // the page head); this wires up the button and keeps the label, the browser
  // colour and the saved choice in step.
  function initTheme() {
    var root = document.documentElement;
    var btn = document.getElementById("theme");
    var meta = document.querySelector('meta[name="theme-color"]');
    var saved = false;
    try { var s = localStorage.getItem("kbo-theme"); saved = s === "light" || s === "dark"; } catch (e) {}

    function apply(t, remember) {
      root.setAttribute("data-theme", t);
      if (btn) btn.setAttribute("aria-label", t === "light" ? "Switch to night mode" : "Switch to day mode");
      if (meta) meta.setAttribute("content", t === "light" ? "#faf6ee" : "#08080a");
      if (remember) { saved = true; try { localStorage.setItem("kbo-theme", t); } catch (e) {} }
    }

    apply(root.getAttribute("data-theme") === "light" ? "light" : "dark", false);
    if (btn) btn.addEventListener("click", function () {
      apply(root.getAttribute("data-theme") === "light" ? "dark" : "light", true);
    });

    // Until the visitor chooses, keep following the device setting
    var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: light)") : null;
    function onDevice(e) { if (!saved) apply(e.matches ? "light" : "dark", false); }
    if (mq) { if (mq.addEventListener) mq.addEventListener("change", onDevice); else if (mq.addListener) mq.addListener(onDevice); }
  }

  // Active tab. On the home page the tab follows the section you have scrolled
  // to (Memes, Shorts, Blog). On other pages the server already marks the tab
  // of the current page (Blog on /blog/ and articles, Memes on /memes/).
  function initTabSpy() {
    if (!document.getElementById("top")) return;
    var tabs = Array.prototype.slice.call(document.querySelectorAll(".nav ul a[data-spy]"));
    var sections = tabs.map(function (a) { return document.getElementById(a.getAttribute("data-spy")); });
    if (!sections.some(Boolean)) return;

    function spy() {
      var cur = -1;
      sections.forEach(function (s, i) {
        if (s && s.getBoundingClientRect().top < window.innerHeight * 0.4) cur = i;
      });
      tabs.forEach(function (a, i) {
        var on = i === cur;
        a.classList.toggle("active", on);
        if (on) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current");
      });
    }
    window.addEventListener("scroll", spy, { passive: true });
    window.addEventListener("resize", spy);
    spy();
  }

  // Mobile menu (the floating pill shows a button under 720 px)
  function initMenu() {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("site-nav");
    if (!toggle || !nav) return;

    function setOpen(open) {
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      nav.classList.toggle("is-open", open);
    }

    toggle.addEventListener("click", function () {
      setOpen(toggle.getAttribute("aria-expanded") !== "true");
    });

    // Close after choosing a link
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setOpen(false);
    });

    // Close on Escape and return focus to the button
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && toggle.getAttribute("aria-expanded") === "true") {
        setOpen(false);
        toggle.focus();
      }
    });

    // Reset when resizing up to the desktop layout
    var desktop = window.matchMedia("(min-width: 721px)");
    function onChange(mq) { if (mq.matches) setOpen(false); }
    if (desktop.addEventListener) desktop.addEventListener("change", onChange);
    else if (desktop.addListener) desktop.addListener(onChange);
  }

  // Scroll-assembled words: each word flies in and settles as you scroll.
  // With reduced motion the words stay in place.
  function initWords() {
    var block = document.querySelector(".words");
    var words = block ? Array.prototype.slice.call(block.querySelectorAll(".w")) : [];
    if (!words.length) return;

    words.forEach(function (w, i) {
      w.dataset.dx = ((i * 37) % 7 - 3) * 60;
      w.dataset.dy = ((i * 53) % 5 - 2) * 40;
      w.dataset.rot = ((i * 29) % 9 - 4) * 4;
    });

    function onScroll() {
      var s = block.getBoundingClientRect();
      var p = 1 - (s.top + s.height * 0.3) / window.innerHeight;
      p = Math.min(1, Math.max(0, p * 1.6));
      var k = reduceMotion ? 0 : 1 - p;
      words.forEach(function (w) {
        w.style.transform = "translate(" + w.dataset.dx * k + "px," + w.dataset.dy * k + "px) rotate(" + w.dataset.rot * k + "deg)";
        w.classList.toggle("hot", p > 0.85);
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
  }

  // "Load more": a list marked data-paged="N" shows N items, and the
  // button after it reveals N more. Without JS everything stays visible.
  function initPaging() {
    var lists = document.querySelectorAll("[data-paged]");
    Array.prototype.forEach.call(lists, function (list) {
      var size = parseInt(list.getAttribute("data-paged"), 10) || 12;
      var items = Array.prototype.slice.call(list.children);
      var wrap = list.nextElementSibling;
      var button = wrap && wrap.querySelector("[data-more]");
      if (!button || items.length <= size) return;

      var shown = size;
      items.forEach(function (li, i) { li.hidden = i >= shown; });
      button.hidden = false;

      button.addEventListener("click", function () {
        var first = shown;
        shown = Math.min(shown + size, items.length);
        for (var i = first; i < shown; i++) items[i].hidden = false;
        if (shown >= items.length) button.hidden = true;
        // keep keyboard focus on the first newly revealed item
        var link = items[first].querySelector("a");
        if (link) link.focus();
      });
    });
  }

  // Share buttons: "Copy link" only works with JS, so it starts hidden.
  function initCopyLink() {
    var buttons = document.querySelectorAll("[data-copy]");
    Array.prototype.forEach.call(buttons, function (btn) {
      if (!navigator.clipboard || !navigator.clipboard.writeText) return;
      btn.hidden = false;
      var status = btn.parentNode.querySelector(".copy-status");
      btn.addEventListener("click", function () {
        navigator.clipboard.writeText(btn.getAttribute("data-copy")).then(function () {
          if (status) status.textContent = "Link copied";
          btn.textContent = "Copied!";
          setTimeout(function () { btn.textContent = "Copy link"; if (status) status.textContent = ""; }, 2000);
        });
      });
    });
  }

  // Meme lightbox: uses <dialog>. Works for the home rows and the /memes/ grid.
  // Without JS (or without <dialog> support) each meme link opens the full image.
  function initLightbox() {
    var dialog = document.querySelector(".lightbox");
    if (!dialog || typeof dialog.showModal !== "function") return;

    var img = dialog.querySelector(".lightbox-img");
    var caption = dialog.querySelector(".lightbox-caption");
    var links = [];
    var current = 0;
    var opener = null;

    // The memes that can be paged through: no looping copies, none hidden by "Load more"
    function collect() {
      return Array.prototype.filter.call(document.querySelectorAll("a[data-lb]"), function (a) {
        if (a.hasAttribute("data-dup")) return false;
        var li = a.closest("li");
        return !(li && li.hidden);
      });
    }

    function show(i) {
      current = (i + links.length) % links.length;
      var thumb = links[current].querySelector("img");
      img.src = links[current].getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      caption.textContent = (thumb ? thumb.alt : "") + " (" + (current + 1) + " / " + links.length + ")";
    }

    document.addEventListener("click", function (e) {
      var link = e.target.closest("a[data-lb]");
      if (!link) return;
      e.preventDefault();
      links = collect();
      var href = link.getAttribute("href");
      var index = 0;
      links.forEach(function (l, i) { if (l.getAttribute("href") === href) index = i; });
      opener = link;
      show(index);
      dialog.showModal();
      dialog.querySelector(".lb-close").focus();
    });

    dialog.querySelector(".lb-prev").addEventListener("click", function () { show(current - 1); });
    dialog.querySelector(".lb-next").addEventListener("click", function () { show(current + 1); });
    dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });

    // Click on the dark area (not the image or buttons) closes
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });

    dialog.addEventListener("keydown", function (e) {
      if (e.key === "ArrowLeft") { e.preventDefault(); show(current - 1); }
      else if (e.key === "ArrowRight") { e.preventDefault(); show(current + 1); }
    });

    // Esc is handled by <dialog>; return focus to the meme that opened it
    dialog.addEventListener("close", function () {
      img.removeAttribute("src");
      if (opener) opener.focus();
    });

    // Swipe left/right on touch screens
    var startX = null, startY = null;
    dialog.addEventListener("touchstart", function (e) {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });
    dialog.addEventListener("touchend", function (e) {
      if (startX === null) return;
      var dx = e.changedTouches[0].clientX - startX;
      var dy = e.changedTouches[0].clientY - startY;
      startX = startY = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) show(current + (dx < 0 ? 1 : -1));
    }, { passive: true });
  }

  // KBO Kids News: the play button opens the Short in a pop-up.
  // The video is only loaded when it is opened. Without JS the button is a
  // normal link to the Short on YouTube.
  function initShortDialog() {
    var dialog = document.querySelector(".short-dialog");
    var play = document.querySelector("[data-short]");
    if (!dialog || !play || typeof dialog.showModal !== "function") return;

    var frame = dialog.querySelector("iframe");

    play.addEventListener("click", function (e) {
      e.preventDefault();
      frame.src = frame.getAttribute("data-src");
      dialog.showModal();
      dialog.querySelector(".lb-close").focus();
    });
    dialog.querySelector(".lb-close").addEventListener("click", function () { dialog.close(); });
    dialog.addEventListener("click", function (e) {
      if (e.target === dialog) dialog.close();
    });
    dialog.addEventListener("close", function () {
      frame.removeAttribute("src");
      play.focus();
    });
  }
})();
