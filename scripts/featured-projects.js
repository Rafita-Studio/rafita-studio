(function () {
  var fallbackProjects = [
    { title: "Digital Doggies", slug: "digital-doggies", year: 2026, category: "print", cover: "assets/catalogo/A4-digitaldoggies.png" },
    { title: "Perritos A4", slug: "perritos-a4", year: 2026, category: "ilustracion", cover: "assets/catalogo/A4_dogs.png" },
    { title: "Sticker Club", slug: "sticker-club", year: 2026, category: "stickers", cover: "assets/catalogo/sticker_01.png" },
    { title: "Aurora", slug: "aurora", year: 2025, category: "identidad", cover: "assets/images/RS_aurora_fondo.png" },
    { title: "Doggies Pack", slug: "doggies-pack", year: 2025, category: "pack", cover: "assets/images/trabajos_new-04.jpg" },
    { title: "Rafita Prints", slug: "rafita-prints", year: 2025, category: "prints", cover: "assets/images/trabajos_new-05.jpg" },
    { title: "Mini Posters", slug: "mini-posters", year: 2025, category: "poster", cover: "assets/images/trabajos_new-06.jpg" },
    { title: "Perrito Azul", slug: "perrito-azul", year: 2024, category: "ilustracion", cover: "assets/catalogo/08.jpg" },
    { title: "Amistad", slug: "amistad", year: 2024, category: "ilustracion", cover: "assets/catalogo/09.jpg" },
    { title: "Kiosco", slug: "kiosco", year: 2024, category: "producto", cover: "assets/catalogo/10.png" },
  ];

  var desktopLayout = {
    top: 120,
    bottom: 190,
    itemGap: 170,
    minX: 14,
    maxX: 86,
    xJitter: 5,
    yJitter: 58,
    width: 24,
  };
  var mobileLayout = {
    top: 230,
    bottom: 150,
    rowHeight: 440,
    minX: 50,
    maxX: 50,
    cellPadX: 0,
    cellPadY: 32,
    width: 78,
  };

  function sortProjects(a, b) {
    var aOrder = Number(a.order);
    var bOrder = Number(b.order);
    var aHasOrder = Number.isFinite(aOrder);
    var bHasOrder = Number.isFinite(bOrder);

    if (aHasOrder && bHasOrder && aOrder !== bOrder) return aOrder - bOrder;
    if (aHasOrder !== bHasOrder) return aHasOrder ? -1 : 1;
    return String(a.title || "").localeCompare(String(b.title || ""), "es", { sensitivity: "base" });
  }

  function projectHref(project) {
    if (project.slug) return "pages/proyectos/" + encodeURIComponent(project.slug) + ".html";
    if (project.url) return String(project.url).replace(/^\/?pages\//, "pages/");
    return "pages/proyectos.html";
  }

  function localAssetPath(value) {
    if (!value) return "";
    if (/^(https?:)?\/\//.test(value) || value.startsWith("data:")) return value;
    return String(value).replace(/^\/+/, "");
  }

  function coverAlt(project) {
    if (project.coverAlt) return project.coverAlt;
    if (Array.isArray(project.gallery)) {
      var cover = String(project.cover || "").replace(/^\/+/, "");
      var match = project.gallery.find(function (item) {
        if (!item || typeof item !== "object") return false;
        return String(item.image || item.src || item.url || "").replace(/^\/+/, "") === cover;
      });
      if (match && match.alt) return match.alt;
    }
    return project.title || project.category || "Proyecto Rafita Studio";
  }

  function randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  function shuffleItems(items) {
    var shuffled = items.slice();
    for (var index = shuffled.length - 1; index > 0; index--) {
      var swapIndex = Math.floor(Math.random() * (index + 1));
      var current = shuffled[index];
      shuffled[index] = shuffled[swapIndex];
      shuffled[swapIndex] = current;
    }
    return shuffled;
  }

  function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
  }

  function createDesktopLayout(count, config) {
    var patternHeight = 1120;
    var height = Math.max(900, config.top + config.bottom + Math.ceil(count / 5) * patternHeight);
    var halfWidth = config.width / 2;
    var bounds = {
      left: Math.max(config.minX, halfWidth + 4),
      right: Math.min(config.maxX, 100 - halfWidth - 4),
      top: config.top,
      bottom: height - config.bottom - 150,
    };
    bounds.width = bounds.right - bounds.left;
    bounds.height = bounds.bottom - bounds.top;

    var template = [
      { x: 19, y: 300 },
      { x: 38, y: 500 },
      { x: 80, y: 280 },
      { x: 15, y: 910 },
      { x: 68, y: 800 },
    ];
    var groupTemplates = Array.from({ length: Math.ceil(count / template.length) }, function () {
      return shuffleItems(template);
    });

    var positions = Array.from({ length: count }, function (_, index) {
      var group = Math.floor(index / template.length);
      var groupTemplate = groupTemplates[group];
      var point = groupTemplate[index % template.length];
      var y = config.top + group * patternHeight + point.y;
      return {
        x: clamp(point.x + randomBetween(-config.xJitter, config.xJitter), bounds.left, bounds.right).toFixed(2),
        y: Math.round(clamp(y + randomBetween(-config.yJitter, config.yJitter), bounds.top, bounds.bottom)),
        w: config.width + "vw",
        mw: mobileLayout.width + "vw",
        z: 4 + index,
      };
    });

    return {
      config,
      positions: shuffleItems(positions),
      height,
    };
  }

  function createLayout(count) {
    var isMobile = window.matchMedia("(max-width: 720px)").matches;
    var config = isMobile ? mobileLayout : desktopLayout;

    if (isMobile) {
      var mobilePositions = Array.from({ length: count }, function (_, index) {
        return {
          x: "50.00",
          y: config.top + index * config.rowHeight,
          w: config.width + "vw",
          mw: config.width + "vw",
          z: 4 + index,
        };
      });

      return {
        config,
        positions: mobilePositions,
        height: Math.max(620, config.top + Math.max(0, count - 1) * config.rowHeight + config.bottom + 170),
      };
    }

    return createDesktopLayout(count, config);
  }

  function renderThumb(project, index, positions) {
    var position = positions[index];
    var link = document.createElement("a");
    link.className = "featured-project-thumb";
    link.href = projectHref(project);
    link.setAttribute("aria-label", "Proyecto destacado " + (project.title || "Rafita Studio"));
    link.style.setProperty("--x", position.x + "%");
    link.style.setProperty("--y", position.y + "px");
    link.style.setProperty("--w", position.w);
    link.style.setProperty("--mobile-w", position.mw);
    link.style.setProperty("--z", position.z);

    var image = document.createElement("img");
    image.src = localAssetPath(project.cover);
    image.alt = coverAlt(project);
    image.loading = "lazy";
    link.appendChild(image);

    var caption = document.createElement("span");
    caption.className = "featured-project-caption";

    var title = document.createElement("span");
    title.textContent = project.title || "Proyecto";
    caption.appendChild(title);

    var year = document.createElement("span");
    year.textContent = project.year || project.category || "";
    caption.appendChild(year);

    link.appendChild(caption);
    return link;
  }

  function renderProjects(section, inner, stage, projects) {
    var source = projects.length > 0 ? projects : fallbackProjects.slice(0, 5);
    var visibleProjects = source.filter(function (project) {
      return project && project.cover;
    });

    if (visibleProjects.length === 0) return;

    var layout = createLayout(visibleProjects.length);
    stage.innerHTML = "";
    inner.style.setProperty("--featured-height", Math.round(layout.height) + "px");
    visibleProjects.forEach(function (project, index) {
      stage.appendChild(renderThumb(project, index, layout.positions));
    });

    section.hidden = false;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var section = document.querySelector(".featured-projects-section");
    var inner = document.querySelector(".featured-projects-inner");
    var stage = document.getElementById("featured-projects-stage");

    if (!section || !inner || !stage) return;

    fetch("./data/projects.json", { cache: "no-cache" })
      .then(function (response) {
        if (!response.ok) throw new Error("No se pudo cargar projects.json");
        return response.json();
      })
      .then(function (projects) {
        var featured = Array.isArray(projects)
          ? projects.filter(function (project) {
              return project && project.featured === true && project.published !== false;
            }).sort(sortProjects)
          : [];

        renderProjects(section, inner, stage, featured);
      })
      .catch(function () {
        renderProjects(section, inner, stage, []);
      });
  });
})();
