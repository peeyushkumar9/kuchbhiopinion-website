// Kuch Bhi Opinion — base behaviour
(function () {
  "use strict";

  document.documentElement.classList.remove("no-js");

  // Footer year
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  initLightbox();

  // Mobile menu
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
  var desktop = window.matchMedia("(min-width: 768px)");
  function onChange(mq) { if (mq.matches) setOpen(false); }
  if (desktop.addEventListener) desktop.addEventListener("change", onChange);
  else if (desktop.addListener) desktop.addListener(onChange);

  // Meme lightbox: uses <dialog>. Without JS (or without <dialog>
  // support) each meme link simply opens the full image.
  function initLightbox() {
    var dialog = document.querySelector(".lightbox");
    var links = Array.prototype.slice.call(document.querySelectorAll(".meme-grid .meme"));
    if (!dialog || !links.length || typeof dialog.showModal !== "function") return;

    var img = dialog.querySelector(".lightbox-img");
    var caption = dialog.querySelector(".lightbox-caption");
    var current = 0;
    var opener = null;

    function show(i) {
      current = (i + links.length) % links.length;
      var thumb = links[current].querySelector("img");
      img.src = links[current].getAttribute("href");
      img.alt = thumb ? thumb.alt : "";
      caption.textContent = (thumb ? thumb.alt : "") + " (" + (current + 1) + " / " + links.length + ")";
    }

    links.forEach(function (link, i) {
      link.addEventListener("click", function (e) {
        e.preventDefault();
        opener = link;
        show(i);
        dialog.showModal();
        dialog.querySelector(".lb-close").focus();
      });
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
})();
