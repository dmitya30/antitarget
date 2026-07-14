/* AntiTarget /remont/ — sticky-CTA + deep-link в боты (payload места) + метрика */
(function () {
  "use strict";

  /* ---- Боты: базовые ссылки + start-параметр (payload = место клика) ---- */
  var MAX_BOT = "https://max.ru/id330573539826_bot?start=";
  var TG_BOT  = "https://telegram.me/antitarget_rembot?start=";

  /* ---- Payload места (data-cta / data-tg -> метка) ---- */
  var PAYLOAD = {
    header: "site_header",
    hero:   "site",
    sticky: "site",
    final:  "site_final"
  };

  /* ---- 1. Липкая мобильная кнопка после первого экрана ---- */
  var sticky = document.querySelector(".sticky-cta");
  var hero = document.getElementById("hero");
  if (sticky && hero && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      sticky.classList.toggle("is-visible", !entries[0].isIntersecting);
    }, { rootMargin: "-40% 0px 0px 0px" });
    io.observe(hero);
  }

  /* ---- 2. МАКС-кнопки ---- */
  document.querySelectorAll("[data-cta]").forEach(function (el) {
    var place = el.getAttribute("data-cta");
    el.setAttribute("href", MAX_BOT + (PAYLOAD[place] || "site"));
    el.addEventListener("click", function () {
      if (typeof window.ym === "function" && window.__ymId) {
        window.ym(window.__ymId, "reachGoal", "cta_click", { place: place });
      }
    });
  });

  /* ---- 3. ТГ-сноски ---- */
  document.querySelectorAll("[data-tg]").forEach(function (el) {
    var place = el.getAttribute("data-tg");
    el.setAttribute("href", TG_BOT + (PAYLOAD[place] || "site"));
    el.addEventListener("click", function () {
      if (typeof window.ym === "function" && window.__ymId) {
        window.ym(window.__ymId, "reachGoal", "tg_click", { place: place });
      }
    });
  });
})();
