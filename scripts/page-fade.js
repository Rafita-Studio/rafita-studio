(function () {
  function revealPage() {
    requestAnimationFrame(function () {
      document.body.classList.add("page-fade-ready");
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", revealPage, { once: true });
  } else {
    revealPage();
  }
})();
