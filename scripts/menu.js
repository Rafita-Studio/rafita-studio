// Menu hamburguesa compartido. Requiere styles/menu.css.
// Las rutas se resuelven desde la ubicacion de este script, asi funciona en /, /pages y /pages/proyectos.
(function () {
  var script = document.currentScript;
  var root = script ? new URL("../", script.src) : new URL("./", window.location.href);
  var palette = ["#ff9418","#66b6e9","#099947","#f193c9","#ff3122","#ffc21a","#0d73c8","#5833a3"];
  var items = [
    { label: "proyectos", href: "pages/proyectos.html" },
    { label: "ilustraciones", href: "pages/catalogo.html" },
    { label: "nosotros", href: "pages/about.html" },
    { label: "kiosco <3", href: "https://piruetasxyz.myshopify.com/collections/rafita-studio", external: true },
    { label: "contacto :)", href: "pages/contact.html" }
  ];

  function pickColor() {
    return palette[Math.floor(Math.random() * palette.length)];
  }

  function buildMenu() {
    var toggle = document.createElement("button");
    toggle.className = "menu-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.setAttribute("aria-controls", "site-menu");
    toggle.innerHTML = '<span class="menu-toggle-lines" aria-hidden="true"><span></span><span></span><span></span></span>';

    var menu = document.createElement("div");
    menu.className = "site-menu";
    menu.id = "site-menu";
    menu.setAttribute("aria-hidden", "true");
    menu.innerHTML =
      '<span class="menu-blob menu-blob-back" aria-hidden="true"></span>' +
      '<span class="menu-blob menu-blob-front" aria-hidden="true"></span>' +
      '<span class="menu-colors" aria-hidden="true"><span></span><span></span><span></span><span></span><span></span></span>' +
      '<nav class="menu-nav" aria-label="Menu principal"><div class="menu-nav-inner"></div></nav>';

    var inner = menu.querySelector(".menu-nav-inner");
    var current = window.location.href.split(/[?#]/)[0];

    items.forEach(function (item, index) {
      var link = document.createElement("a");
      link.className = "menu-link";
      link.style.setProperty("--menu-i", index);
      link.href = item.external ? item.href : new URL(item.href, root).href;
      if (item.external) {
        link.target = "_blank";
        link.rel = "noopener";
      } else if (link.href === current) {
        link.setAttribute("aria-current", "page");
      }

      var number = document.createElement("span");
      number.className = "menu-link-number";
      number.textContent = index + 1;

      var text = document.createElement("span");
      text.className = "menu-link-text";
      text.textContent = item.label;

      link.appendChild(number);
      link.appendChild(text);
      inner.appendChild(link);
    });

    document.body.insertBefore(menu, document.body.firstChild);
    document.body.insertBefore(toggle, document.body.firstChild);
    return { toggle: toggle, menu: menu };
  }

  function init() {
    var built = buildMenu();
    var toggle = built.toggle;
    var menu = built.menu;
    var links = Array.prototype.slice.call(menu.querySelectorAll(".menu-link"));
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    function randomHover(link) {
      var rotate = (Math.random() < 0.5 ? -1 : 1) * (1 + Math.random() * 2.6);
      link.style.setProperty("--menu-hover-color", pickColor());
      link.style.setProperty("--menu-hover-rotate", rotate.toFixed(2) + "deg");
    }

    function updateLineGap() {
      var lines = toggle.querySelector(".menu-toggle-lines");
      if (lines) toggle.style.setProperty("--menu-line-gap", (lines.offsetHeight / 2 - 1.25).toFixed(2) + "px");
    }

    function setOpen(open) {
      document.body.classList.toggle("menu-open", open);
      document.documentElement.classList.toggle("menu-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Cerrar menu" : "Abrir menu");
      menu.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) {
        toggle.style.setProperty("--menu-accent", pickColor());
        links.forEach(randomHover);
      }
    }

    toggle.addEventListener("mouseenter", function () {
      toggle.style.setProperty("--menu-accent", pickColor());
    });

    toggle.addEventListener("click", function () {
      setOpen(!document.body.classList.contains("menu-open"));
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && document.body.classList.contains("menu-open")) {
        setOpen(false);
        toggle.focus();
      }
    });

    links.forEach(function (link) {
      link.addEventListener("mouseenter", function () {
        randomHover(link);
      });

      link.addEventListener("click", function (event) {
        if (link.target === "_blank" || reduceMotion || event.metaKey || event.ctrlKey || event.shiftKey) return;
        event.preventDefault();
        setOpen(false);
        setTimeout(function () {
          window.location.href = link.href;
        }, 650);
      });
    });

    window.addEventListener("pageshow", function () {
      setOpen(false);
    });

    updateLineGap();
    window.addEventListener("resize", updateLineGap);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
