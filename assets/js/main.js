/* AntiTarget /remont/ — минимальный JS: sticky-CTA + deep-link + метрика */
(function () {
  "use strict";

  /* ---- КОНФИГ deep-link МАКС-бота (единственная точка правки при появлении бота) ---- */
  var MAX_BOT_URL = ""; // напр. "https://max.ru/antitarget_bot?start=" — пока пусто = заглушка

  /* ---- 1. Липкая мобильная кнопка: показывать после прокрутки первого экрана ---- */
  var sticky = document.querySelector(".sticky-cta");
  var hero = document.getElementById("hero");
  if (sticky && hero && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      // hero виден -> прячем липкую; hero ушёл вверх -> показываем
      sticky.classList.toggle("is-visible", !entries[0].isIntersecting);
    }, { rootMargin: "-40% 0px 0px 0px" });
    io.observe(hero);
  }

  /* ---- 2. CTA: подстановка deep-link + UTM + событие метрики ---- */
  function buildBotLink() {
    if (!MAX_BOT_URL) return null;
    var p = new URLSearchParams(window.location.search);
    var utm = [];
    ["utm_source","utm_medium","utm_campaign","utm_content","utm_term"].forEach(function (k) {
      if (p.get(k)) utm.push(k + "=" + encodeURIComponent(p.get(k)));
    });
    return MAX_BOT_URL + (utm.length ? "&" + utm.join("&") : "");
  }

  var botLink = buildBotLink();
  var ctas = document.querySelectorAll("[data-cta]");
  ctas.forEach(function (el) {
    // если реальная ссылка бота задана — CTA ведут в бота, иначе остаются якорем #start
    if (botLink) el.setAttribute("href", botLink);

    el.addEventListener("click", function () {
      var place = el.getAttribute("data-cta"); // hero|header|sticky|final
      // Яндекс.Метрика цель (сработает, когда Саныч вставит счётчик; ym определится глобально)
      if (typeof window.ym === "function" && window.__ymId) {
        window.ym(window.__ymId, "reachGoal", "cta_click", { place: place });
      }
    });
  });
})();
